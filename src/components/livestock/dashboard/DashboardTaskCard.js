import React from 'react';
import { Card, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui';

const DashboardTaskCard = props => {
  return (
    <Card style={{ height: '60%', marginTop: 10, padding: 10 }}>
      <Typography variant="title" color="primary">
        {props.i18n.tasks}
      </Typography>
      <div className="dashboard-task_card-body">
        <Typography variant="title">{props.i18n.taskTitle}</Typography>
        <List>
          {props.tasks.map(value => (
            <ListItem key={value.id}>
              <ListItemText primary={value.title} />
              <ListItemSecondaryAction>
                <span>{value.date}</span>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </Card>
  );
};

export default DashboardTaskCard;
