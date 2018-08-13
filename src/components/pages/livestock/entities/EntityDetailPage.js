import React, { Component, Fragment } from 'react';
import '../livestock.css';
import ViewEntity from '../../../livestock/entities/ViewEntity';
import EditEntity from '../../../livestock/entities/EditEntity';
import EntityService from '../../../../services/EntityService';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import { CircularProgress } from 'material-ui';
import { I18nContext } from '../../../App';

class EntityDetailPage extends Component {
  constructor() {
    super();
    this.state = {
      edit: null,
      serverError: null,
      isLoading: false,
    };
  }

  componentWillMount() {
    const { id } = this.props.match.params;

    if (id) {
      const getOneEntityResponse = EntityService.getOneEntity(id, true);

      getOneEntityResponse
        .then(res => {
          this.setState({ ...res.data });
        })
        .catch(err => this.setState({ serverError: true }));
    }
  }

  onDialogClose(e) {
    this.setState({ errors: null, serverError: null });
  }

  onClick = e => {
    this.setState({ edit: true });
  };

  onCancel = e => {
    this.setState({ edit: null, isLoading: true });
    const { id } = this.props.match.params;

    if (id) {
      const getOneEntityResponse = EntityService.getOneEntity(id, true);

      getOneEntityResponse
        .then(res => {
          this.setState({ ...res.data, isLoading: false });
        })
        .catch(err => this.setState({ serverError: true, isLoading: false }));
    }
  };

  render() {
    const { edit, serverError, isLoading } = this.state;
    let view = (
      <I18nContext.Consumer>
        {({ i18n }) => <ViewEntity i18n={i18n} onClick={this.onClick} entityData={this.state} />}
      </I18nContext.Consumer>
    );

    if (edit)
      view = (
        <I18nContext.Consumer>
          {({ i18n }) => (
            <EditEntity i18n={i18n} onCancel={this.onCancel} entityData={this.state} />
          )}
        </I18nContext.Consumer>
      );

    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
            {view}
            {serverError && (
              <ErrorDialog
                title={i18n.general.serverErrorTitle}
                text={i18n.general.serverErrorMessage}
                onDialogClose={this.onDialogClose}
              />
            )}
            {isLoading && (
              <CircularProgress
                style={{
                  height: '80px',
                  width: '80px',
                  top: '50%',
                  left: '50%',
                  position: 'absolute',
                }}
              />
            )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default EntityDetailPage;
