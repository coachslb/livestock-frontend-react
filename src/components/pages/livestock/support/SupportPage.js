import React, { Component, Fragment } from 'react';
import {
  Typography,
  Grid,
  FormControl,
  Input,
  InputLabel,
  Button,
  Card,
  CircularProgress,
} from 'material-ui';
import HistorySupport from '../../../livestock/support/HistorySupport';
import ErrorDialog from '../../../UI/ErrorDialog/ErrorDialog';
import { I18nContext } from '../../../App';
import './support.css';
import SupportService from '../../../../services/SupportService';

class SupportPage extends Component {
  state = {
    support: '',
    message: '',
    historyData: null,
    isLoading: false,
    serverError: null,
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    const getSupportMessagePromise = SupportService.get(localStorage.getItem('userId'), true);

    getSupportMessagePromise
      .then(res => {
        this.setState({ historyData: res.data, isLoading: false, serverError: false });
      })
      .catch(err => {
        this.setState({ isLoading: false, serverError: true });
      });
  }

  onSubmitMessage = () => {
    const { subject, message } = this.state;
    this.setState({ isLoading: true });
    const sendSupportMessagePromise = SupportService.create(
      {
        userId: localStorage.getItem('userId'),
        subject,
        message,
      },
      true,
    );

    sendSupportMessagePromise
      .then(res => {
        this.setState({ historyData: res.data, isLoading: false, serverError: false, subject: '', message: '' });
      })
      .catch(err => {
        this.setState({ isLoading: false, serverError: true });
      });
  };

  onDialogClose = e => {
    this.setState({ serverError: null });
  };

  render() {
    const { subject, message, historyData, isLoading, serverError } = this.state;
    return (
      <I18nContext.Consumer>
        {({ i18n }) => (
          <Fragment>
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
                  position: 'fixed',
                }}
              />
            )}
            {!isLoading && (
              <div className="support-section">
                <Card className="support-history-section">
                  <HistorySupport data={historyData} i18n={i18n.support} />
                </Card>
                <Card className="support-form-section">
                  <Typography variant="display1">Em que podemos ajudar</Typography>
                  <Grid container spacing={16}>
                    <Grid item md={4}>
                      <FormControl fullWidth>
                        <InputLabel>{i18n.support.subject}*</InputLabel>
                        <Input name="subject" value={subject} onChange={this.handleChange} />
                      </FormControl>
                    </Grid>
                    <Grid item md={12}>
                      <FormControl fullWidth>
                        <InputLabel>
                          {i18n.support.message}
                          ...
                        </InputLabel>
                        <Input
                          multiline
                          name="message"
                          value={message}
                          onChange={this.handleChange}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={12}>
                      <Button
                        size="medium"
                        variant="raised"
                        color="primary"
                        className="card-button"
                        onClick={this.onSubmitMessage}
                      >
                        {i18n.support.button.send}
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </div>
            )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default SupportPage;
