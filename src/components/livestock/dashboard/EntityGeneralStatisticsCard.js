import React from 'react';
import { Card, CardContent, Typography } from 'material-ui';

const EntityGeneralStatisticsCard = props => {
  return (
    <Card className="statistics-card">
      <CardContent>
        <Typography variant="title" color="primary">
          {props.i18n.entityData}
        </Typography>
        <div className="statistics-data">
          <p className="statistic-element">
            <span className="statistic-element-number">
              {props.explorations < 10 ? `0${props.explorations}` : props.explorations}
            </span>{' '}
            {props.i18n.explorations}
          </p>
          <p className="statistic-element">
            <span className="statistic-element-number">
              {props.places < 10 ? `0${props.places}` : props.places}
            </span>{' '}
            {props.i18n.places}
          </p>
          <p className="statistic-element">
            <span className="statistic-element-number">
              {props.animals < 10 ? `0${props.animals}` : props.animals}
            </span>{' '}
            {props.i18n.animals}
          </p>
          <p className="statistic-element">
            <span className="statistic-element-number">
              {props.managements < 10 ? `0${props.managements}` : props.managements}
            </span>{' '}
            {props.i18n.managements}
          </p>
          <p className="statistic-element">
            <span className="statistic-element-number">
              {props.users < 10 ? `0${props.users}` : props.users}
            </span>{' '}
            {props.i18n.workers}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EntityGeneralStatisticsCard;
