import React from 'react';
import { Card, CardContent, Typography } from 'material-ui';
import { Link } from 'react-router-dom';

const EntityGeneralStatisticsCard = props => {
  return (
    <Card className="statistics-card">
      <CardContent>
        <Typography variant="title" color="primary">
          {props.i18n.entityData}
        </Typography>
        <div className="statistics-data">
          <Link className="statistic-element" to={`/livestock/explorations/${localStorage.getItem('entityId')}`}>
            <div className="statistic-element-number">
              {props.explorations < 10 ? `0${props.explorations}` : props.explorations}
            </div>{' '}
            <Typography variant="display2">{props.i18n.explorations}</Typography>
          </Link>
          <Link className="statistic-element" to={`/livestock/explorations/${localStorage.getItem('entityId')}`}>
            <span className="statistic-element-number">
              {props.places < 10 ? `0${props.places}` : props.places}
            </span>{' '}
            <Typography variant="display2">{props.i18n.places}</Typography>
          </Link>
          <Link className="statistic-element" to={`/livestock/explorations/${localStorage.getItem('entityId')}`}>
            <span className="statistic-element-number">
              {props.animals < 10 ? `0${props.animals}` : props.animals}
            </span>{' '}
            <Typography variant="display2">{props.i18n.animals}</Typography>
          </Link>
          <Link className="statistic-element" to={`/livestock/management/${localStorage.getItem('entityId')}`}>
            <span className="statistic-element-number">
              {props.managements < 10 ? `0${props.managements}` : props.managements}
            </span>{' '}
            <Typography variant="display2">{props.i18n.managements}</Typography>
          </Link>
          <Link className="statistic-element" to={`/livestock/users/${localStorage.getItem('entityId')}`}>
            <span className="statistic-element-number">
              {props.users < 10 ? `0${props.users}` : props.users}
            </span>{' '}
            <Typography variant="display2">{props.i18n.workers}</Typography>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default EntityGeneralStatisticsCard;
