import React, { Component, Fragment } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Hidden,
  Drawer,
  Divider,
  CssBaseline,
  Tabs,
  Tab,
} from 'material-ui';
import { Link, withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { compose } from 'recompose';
import './layout.css';
import { Menu } from '@material-ui/icons';
import { MenuList, MenuItem } from 'material-ui';
import ErrorDialog from '../../UI/ErrorDialog/ErrorDialog';
import EntityValidations from '../../../validations/EntityValidations';
import EntityService from '../../../services/EntityService';
import { I18nContext } from '../../../components/App';
import '../../pages/livestock/livestock.css';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  entityName: {
    flex: 1,
  },
  tabs: {
    [theme.breakpoints.up('md')]: {
      marginLeft: 240,
    },
  },
  appBrand: {
    width: '220px',
    textAlign: 'left',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
      height: 0,
    },
  },
  drawerTabs: {
    minHeight: 108,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

class Layout extends Component {
  constructor() {
    super();
    this.state = {
      mobileOpen: false,
      entityName: null,
      entityId: 0,
      workerId: 0,
      errors: null,
      serverError: null,
      value: 0,
      explorationId: null,
      userPreferences: false,
    };

    this.onDialogClose = this.onDialogClose.bind(this);
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  onDialogClose(e) {
    this.setState({ errors: null, serverError: null });
  }

  handleEntityDetailClick = e => {
    e.preventDefault();
    const entityId = localStorage.getItem('entityId');
    if (entityId !== null) {
      this.props.history.push(`/livestock/entity/${entityId}`);
    }
  };

  handleUserDetailClick = e => {
    e.preventDefault();
    const workerId = localStorage.getItem('workerId');
    const entityId = localStorage.getItem('entityId');
    if (workerId !== null) {
      this.setState({ userPreferences: true });
      this.props.history.push(`/livestock/users/${entityId}/detail/${workerId}`);
    }
  };

  handleChange = (event, value) => {
    this.setState({ value });
    const entityId = localStorage.getItem('entityId');
    const params = this.props.location.pathname.split('/');
    if (value === 0) {
      this.props.history.push(`/livestock/explorations/${entityId}/detail/${params[5]}`);
    } else if (value === 1) {
      this.props.history.push(`/livestock/explorations/${entityId}/place/${params[5]}`);
    } else if (value === 2) {
      this.props.history.push(`/livestock/explorations/${entityId}/animal/${params[5]}`);
    } else if (value === 3) {
      this.props.history.push(`/livestock/explorations/${entityId}/group/${params[5]}`);
    }
  };

  componentWillMount() {
    const entityId = localStorage.getItem('entityId');
    this.setState({ workerId: localStorage.getItem('workerId') });
    if (entityId !== null) {
      const errors = EntityValidations.validateGetOneEntity(entityId);
      if (errors.length > 0) {
        this.setState({ errors });
      } else {
        let getOneEntityResponse = EntityService.getOneEntity(entityId, true);

        getOneEntityResponse
          .then(res => {
            this.setState({ entityName: res.data.name, entityId });
          })
          .catch(err => {
            this.setState({ serverError: true });
          });
      }
    }

    if (this.props.location.pathname.startsWith('/livestock/explorations/')) {
      if (this.props.location.pathname.startsWith(`/livestock/explorations/${entityId}/`)) {
        const params = this.props.location.pathname.split('/');
        switch (params[4]) {
          case 'detail':
            this.setState({ explorationId: params[5], value: 0 });
            break;
          case 'place':
            this.setState({ explorationId: params[5], value: 1 });
            break;
          case 'animal':
            this.setState({ explorationId: params[5], value: 2 });
            break;
          case 'group':
            this.setState({ explorationId: params[5], value: 3 });
            break;
          default:
            this.setState({ explorationId: params[5], value: 0 });
            break;
        }
      }
    }
  }

  render() {
    const {
      classes,
      children,
      location: { pathname },
    } = this.props;

    const {
      mobileOpen,
      value,
      entityName,
      entityId,
      workerId,
      errors,
      serverError,
      userPreferences,
    } = this.state;

    const userPreferencesDrawer = (
      <I18nContext.Consumer>
        {({ i18n, changeLanguage, language }) => (
          <div style={{ top: '0%', position: 'fixed' }}>
            <Hidden smDown>
              <div className={classes.toolbar} />
            </Hidden>
            <MenuList>
              <MenuItem
                className={'menu-item'}
                component={Link}
                to={`/livestock/dashboard/${entityId}`}
                onClick={() => this.setState({ userPreferences: false })}
                style={{ padding: '20px' }}
              >
                <i className="material-icons material-icons-menu">arrow_back</i>
                {i18n.general.users}
              </MenuItem>
            </MenuList>
            <Divider />
            <MenuList>
              <MenuItem
                className={
                  pathname.startsWith(`/livestock/users/${entityId}/detail`)
                    ? 'menu-item-selected'
                    : 'menu-item'
                }
                component={Link}
                to={`/livestock/users/${entityId}/detail/${workerId}`}
                style={{ padding: '20px' }}
                selected={pathname.startsWith(`/livestock/users/${entityId}/detail`)}
              >
                <i className="material-icons material-icons-menu">person</i>
                {i18n.general.profile}
              </MenuItem>
              <MenuItem
                className={
                  pathname.startsWith(`/livestock/users/${entityId}/changeEmail`)
                    ? 'menu-item-selected'
                    : 'menu-item'
                }
                component={Link}
                to={`/livestock/users/${entityId}/changeEmail/${workerId}`}
                style={{ padding: '20px' }}
                selected={pathname.startsWith(`/livestock/users/${entityId}/changeEmail`)}
              >
                {i18n.general.changeEmail}
              </MenuItem>
              <MenuItem
                className={
                  pathname.startsWith(`/livestock/users/${entityId}/changePassword`)
                    ? 'menu-item-selected'
                    : 'menu-item'
                }
                component={Link}
                to={`/livestock/users/${entityId}/changePassword/${workerId}`}
                style={{ padding: '20px' }}
                selected={pathname.startsWith(`/livestock/users/${entityId}/changePassword`)}
              >
                {i18n.general.changePassword}
              </MenuItem>
              <MenuItem
                className={
                  pathname.startsWith(`/livestock/users/${entityId}/changeLanguage`)
                    ? 'menu-item-selected'
                    : 'menu-item'
                }
                component={Link}
                to={`/livestock/users/${entityId}/changeLanguage/${workerId}`}
                style={{ padding: '20px' }}
                selected={pathname.startsWith(`/livestock/users/${entityId}/changeLanguage`)}
              >
                {i18n.general.changeLanguage}
              </MenuItem>
              <MenuItem
                className={
                  pathname.startsWith(`/livestock/users/${entityId}/license`)
                    ? 'menu-item-selected'
                    : 'menu-item'
                }
                component={Link}
                to={`/livestock/users/${entityId}/license/${workerId}`}
                style={{ padding: '20px' }}
                selected={pathname.startsWith(`/livestock/users/${entityId}/license`)}
              >
                {i18n.general.license}
              </MenuItem>
            </MenuList>
            <Divider />
            <MenuList>
              <MenuItem
                className={
                  pathname.startsWith('/livestock/support') ? 'menu-item-selected' : 'menu-item'
                }
                component={Link}
                to="/livestock/support"
                style={{ padding: '20px' }}
                selected={pathname.startsWith('/livestock/support')}
              >
                <i className="material-icons material-icons-menu">headset_mic</i>
                {i18n.general.support}
              </MenuItem>
              <MenuItem
                className={pathname.startsWith('/logout') ? 'menu-item-selected' : 'menu-item'}
                component={Link}
                to="/logout"
                style={{ padding: '20px' }}
                selected={pathname.startsWith('/logout')}
              >
                <i className="material-icons material-icons-menu">exit_to_app</i>
                {i18n.general.logout}
              </MenuItem>
            </MenuList>
          </div>
        )}
      </I18nContext.Consumer>
    );

    const drawer = (
      <I18nContext.Consumer>
        {({ i18n, changeLanguage, language }) => (
          <div style={{ top: '0%', position: 'fixed' }}>
            <Hidden smDown>
              <div
                className={classes.toolbar}
                style={
                  pathname.startsWith(`/livestock/explorations/${entityId}/`)
                    ? { minHeight: 108 }
                    : {}
                }
              />
            </Hidden>
            <MenuList>
              <MenuItem
                className={
                  pathname.startsWith('/livestock/dashboard') ||
                  pathname === '/' ||
                  pathname === '/livestock'
                    ? 'menu-item-selected'
                    : 'menu-item'
                }
                component={Link}
                to={`/livestock/dashboard/${entityId}`}
                style={{ padding: '20px' }}
                selected={pathname.startsWith('/livestock/dashboard')}
              >
                <i className="material-icons material-icons-menu">home</i>
                Dashboard
              </MenuItem>
              <MenuItem
                className={
                  pathname.startsWith('/livestock/explorations')
                    ? 'menu-item-selected'
                    : 'menu-item'
                }
                component={Link}
                to={`/livestock/explorations/${entityId}`}
                style={{ padding: '20px' }}
                selected={pathname.startsWith('/livestock/explorations')}
              >
                <i className="material-icons material-icons-menu">terrain</i>
                {i18n.general.explorations}
              </MenuItem>
              <MenuItem
                className={
                  pathname.startsWith('/livestock/management') ? 'menu-item-selected' : 'menu-item'
                }
                component={Link}
                to={`/livestock/management/${entityId}`}
                style={{ padding: '20px' }}
                selected={pathname.startsWith('/livestock/management')}
              >
                <i className="material-icons material-icons-menu">pets</i>
                {i18n.general.managements}
              </MenuItem>
              <MenuItem
                className={
                  pathname.startsWith('/livestock/tasks') ? 'menu-item-selected' : 'menu-item'
                }
                component={Link}
                to={`/livestock/tasks/${entityId}`}
                style={{ padding: '20px' }}
                selected={pathname.startsWith('/livestock/tasks')}
              >
                <i className="material-icons material-icons-menu">assignment</i>
                {i18n.general.tasks}
              </MenuItem>
              <MenuItem
                className={
                  pathname.startsWith('/livestock/weather') ? 'menu-item-selected' : 'menu-item'
                }
                component={Link}
                to={`/livestock/weather/${entityId}`}
                style={{ padding: '20px' }}
                selected={pathname.startsWith('/livestock/weather')}
              >
                <i className="material-icons material-icons-menu">wb_sunny</i>
                {i18n.general.weather}
              </MenuItem>
              <MenuItem
                className={
                  pathname.startsWith('/livestock/results') ? 'menu-item-selected' : 'menu-item'
                }
                component={Link}
                to="/livestock/results"
                style={{ padding: '20px' }}
                selected={pathname.startsWith('/livestock/results')}
              >
                <i className="material-icons material-icons-menu">poll</i>
                {i18n.general.results}
              </MenuItem>
              <MenuItem
                className={
                  pathname.startsWith('/livestock/red-oc') ? 'menu-item-selected' : 'menu-item'
                }
                component={Link}
                to={`/livestock/red-oc/${entityId}`}
                style={{ padding: '20px' }}
                selected={pathname.startsWith('/livestock/red-oc')}
              >
                <i className="material-icons material-icons-menu">library_books</i>
                RED
              </MenuItem>
            </MenuList>
            <Divider />
            <MenuItem
              className={
                pathname.startsWith('/livestock/users') ? 'menu-item-selected' : 'menu-item'
              }
              component={Link}
              to={`/livestock/users/${entityId}`}
              style={{ padding: '20px' }}
              selected={pathname.startsWith('/livestock/users')}
            >
              <i className="material-icons material-icons-menu">people</i>
              {i18n.general.users}
            </MenuItem>
            <MenuList>
              <MenuItem
                className={
                  pathname.startsWith('/livestock/support') ? 'menu-item-selected' : 'menu-item'
                }
                component={Link}
                to="/livestock/support"
                style={{ padding: '20px' }}
                selected={pathname.startsWith('/livestock/support')}
              >
                <i className="material-icons material-icons-menu">headset_mic</i>
                {i18n.general.support}
              </MenuItem>
              <MenuItem
                className={pathname.startsWith('/logout') ? 'menu-item-selected' : 'menu-item'}
                component={Link}
                to="/logout"
                style={{ padding: '20px' }}
                selected={pathname.startsWith('/logout')}
              >
                <i className="material-icons material-icons-menu">exit_to_app</i>
                {i18n.general.logout}
              </MenuItem>
            </MenuList>
          </div>
        )}
      </I18nContext.Consumer>
    );
    return (
      <I18nContext.Consumer>
        {({ i18n, changeLanguage, language }) => (
          <Fragment>
            <CssBaseline />
            <div className={classes.root}>
              <AppBar
                position="absolute"
                className={classes.appBar}
                style={{ top: '0%', position: 'fixed' }}
              >
                <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={this.handleDrawerToggle}
                    className={classes.navIconHide}
                  >
                    <Menu />
                  </IconButton>
                  <Hidden smDown>
                    <div className="layout-logo" />
                  </Hidden>
                  <Typography variant="title" color="inherit" className={classes.entityName}>
                    {entityName}
                  </Typography>
                  <IconButton
                    aria-haspopup="true"
                    onClick={this.handleEntityDetailClick}
                    color="inherit"
                  >
                    <i className="material-icons">domain</i>
                  </IconButton>
                  <IconButton
                    aria-haspopup="true"
                    onClick={this.handleUserDetailClick}
                    color="inherit"
                  >
                    <i className="material-icons">account_circle</i>
                  </IconButton>
                </Toolbar>
                {pathname.startsWith(`/livestock/explorations/${entityId}/`) && (
                  <Tabs
                    value={value}
                    onChange={this.handleChange}
                    className={classes.tabs}
                    scrollable
                    scrollButtons="auto"
                  >
                    <Tab label={i18n.general.exploration.profile} />
                    <Tab label={i18n.general.exploration.places} />
                    <Tab label={i18n.general.exploration.animals} />
                    <Tab label={i18n.general.exploration.groups} />
                  </Tabs>
                )}
              </AppBar>
              <Hidden mdUp>
                <Drawer
                  variant="temporary"
                  open={mobileOpen}
                  onClose={this.handleDrawerToggle}
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                  ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                  }}
                >
                  {!userPreferences ? drawer : userPreferencesDrawer}
                </Drawer>
              </Hidden>
              <Hidden smDown implementation="css">
                <Drawer
                  variant="permanent"
                  open
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                >
                  {!userPreferences ? drawer : userPreferencesDrawer}
                </Drawer>
              </Hidden>
              <main className={classes.content}>
                <div
                  className={classes.toolbar}
                  style={
                    pathname.startsWith(`/livestock/explorations/${entityId}/`)
                      ? { minHeight: 108 }
                      : {}
                  }
                />
                {children}
              </main>
            </div>
            {errors && (
              <ErrorDialog
                title={i18n.general.genericErrorTitle}
                text={i18n.general.genericErrorMessage}
                onDialogClose={this.onDialogClose}
              />
            )}
            {serverError && (
              <ErrorDialog
                title={i18n.general.serverErrorTitle}
                text={i18n.general.serverErrorMessage}
                onDialogClose={this.onDialogClose}
              />
            )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(Layout);
