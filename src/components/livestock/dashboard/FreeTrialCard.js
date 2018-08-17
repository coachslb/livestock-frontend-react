import React from 'react';
import { Card, CardContent, Typography } from 'material-ui';
import './dashboard.css';

const FreeTrialCard = props => {
  return (
    <Card className="free-trial">
      <CardContent>
        <Typography variant="body2" className="free-trial-message">
        <i className="material-icons" style={{marginRight:"10px"}}>assignment_late</i>
          <strong>{props.i18n.license.trialPeriod}</strong>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FreeTrialCard;
