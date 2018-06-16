import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui';

const ErrorDialog = ({ title, text, onDialogClose }) => (
  <Dialog
    open
    onClose={onDialogClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
      {/* <ul>
        {errors.map(error => {
          return <li key={error}>{error}</li>;
        })}
      </ul> */}
    </DialogContent>
    <DialogActions>
      <Button onClick={onDialogClose} color="primary">
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export default ErrorDialog;
