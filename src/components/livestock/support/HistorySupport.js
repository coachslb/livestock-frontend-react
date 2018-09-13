import React, { Fragment } from 'react';
import { Typography } from 'material-ui';
import SupportMessage from './SupportMessage';

const HistorySupport = props => {
  return (
    <Fragment>
      <Typography variant="display1" style={{ textAlign: 'center', padding: 5 }}>
        {props.i18n.historyTitle}
      </Typography>
      {props.data && props.data.length > 0 && props.data.map(message => {
        return <SupportMessage message={message} i18n={props.i18n}/>;
      })}
      {props.data && props.data.length === 0 && (
        <p>{props.i18n.noHistory}</p>
      )}
    </Fragment>
  );
};

export default HistorySupport;
