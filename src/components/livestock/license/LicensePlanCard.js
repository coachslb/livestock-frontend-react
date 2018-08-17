import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Button } from 'material-ui';

const LicensePlanCard = props => {

  function OnBuyLicense(e) {
    props.buyLicense(e, props.licenseType, props.basePrice);
  }

  return (
    <Card className="plan-card-container">
      <CardContent style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Typography variant="title">{props.i18n.title}</Typography>
        <Typography variant="body1" style={{ marginTop: 10 }}>
          {props.i18n.description}
        </Typography>
        <div className="plan-list-feature">
          <List dense={true}>
            {props.i18n.features.map((feature, index) => {
              return (
                <ListItem key={index}>
                  <ListItemText>
                    <Typography variant="body2">{feature}</Typography>
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>
        </div>
        <div className="plan-price-container">
          <Button variant="raised" color="primary" onClick={OnBuyLicense}>
            {props.i18n.price}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LicensePlanCard;
