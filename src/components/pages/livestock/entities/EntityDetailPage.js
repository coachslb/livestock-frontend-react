import React, { Component, Fragment } from 'react';
import '../livestock.css';
import ViewEntity from '../../../livestock/entities/ViewEntity';
import EditEntity from '../../../livestock/entities/EditEntity';
import EntityService from '../../../../services/EntityService';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import { CircularProgress } from 'material-ui';

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
          this.setState({...res.data});
          console.log(this.state);
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
          this.setState({...res.data, isLoading: false});
        })
        .catch(err => this.setState({ serverError: true, isLoading: false }));
    }
  };

  render() {
    /* const { id } = this.props.match.params; */
    const { edit, serverError, isLoading } = this.state;
    let view = <ViewEntity onClick={this.onClick} entityData={this.state} />;

    if (edit) view = <EditEntity onCancel={this.onCancel} entityData={this.state}/>;

    return (
      <Fragment>
        {view}
        {serverError && (
          <ErrorDialog
            title="Server Error"
            text="There are some server problem"
            onDialogClose={this.onDialogClose}
          />
        )}
        {isLoading && (
          <CircularProgress/>
        )}
      </Fragment>
    );
  }
}

export default EntityDetailPage;
