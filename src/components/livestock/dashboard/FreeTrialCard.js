import React from 'react';
import { Card, CardContent, Typography } from 'material-ui';
import './dashboard.css';

const FreeTrialCard = props => {
  return (
    <Card className="free-trial">
      <CardContent>
        <Typography variant="body2" className="free-trial-message">
        <i className="material-icons" style={{marginRight:"10px"}}>assignment_late</i>
          <strong>Esta conta encontra-se no periodo trial e
          ainda tem 30 dias para usar. Atualize já o seu plano.</strong>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FreeTrialCard;
