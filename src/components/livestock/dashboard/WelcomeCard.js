import React from 'react';
import { Card, CardContent, Typography } from 'material-ui';
import './dashboard.css';

const WelcomeCard = ({i18n}) => {
  return (
    <Card className="welcome-card">
      <CardContent className="welcome-card-container">
        <Typography
          variant="display1"
          className="welcome-card-typography"
          color="primary"
          dangerouslySetInnerHTML={{ __html: i18n.dashboard.welcomeTitle }}
        />
        <Typography variant="subheading" className="welcome-card-typography center">
          {i18n.dashboard.welcomeMessage}
        </Typography>
        <Typography
          variant="body1"
          className="welcome-card-typography center"
          dangerouslySetInnerHTML={{ __html: i18n.dashboard.welcomeMessage2 }}
        />
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
