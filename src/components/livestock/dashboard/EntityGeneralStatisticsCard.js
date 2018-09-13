import React from 'react';
import { Card, CardContent, Typography } from 'material-ui';
import { HashLink as Link } from 'react-router-hash-link';

const EntityGeneralStatisticsCard = props => {
  return (
    <Card className="statistics-card">
      <CardContent>
        <Typography variant="title" color="primary">
          {props.i18n.entityData}
        </Typography>
        <div className="statistics-data">
          {/* <Link
            className="statistic-element"
            to={`/livestock/explorations/${localStorage.getItem('entityId')}`}
          >
            <Typography variant="display2">{props.i18n.explorations}</Typography>
            <span className="statistic-element-number">
              {props.explorations < 10 ? `0${props.explorations}` : props.explorations}
            </span>
          </Link> */}
          {/* <Link
            className="statistic-element"
            to={`/livestock/explorations/${localStorage.getItem('entityId')}`}
          >
            <Typography variant="display2">{props.i18n.places}</Typography>
            <span className="statistic-element-number">
              {props.places < 10 ? `0${props.places}` : props.places}
            </span>
          </Link> */}
          <Link
            className="statistic-element"
            to={`/livestock/explorations/${localStorage.getItem('entityId')}`}
          >
            <Typography variant="display2">{props.i18n.animals}</Typography>
            <span className="statistic-element-number">
              {props.animals < 10 ? `0${props.animals}` : props.animals}
            </span>
          </Link>
          <Link
            className="statistic-element"
            to={`/livestock/explorations/${localStorage.getItem('entityId')}`}
          >
            <Typography variant="display2">{props.i18n.sickAnimals}</Typography>
            <span className="statistic-element-number">
              {props.sickAnimals < 10 ? `0${props.sickAnimals}` : props.sickAnimals}
            </span>
          </Link>
          <Link
            className="statistic-element"
            to={`/livestock/management/${localStorage.getItem('entityId')}`}
          >
            <Typography variant="display2">{props.i18n.managements}</Typography>
            <span className="statistic-element-number">
              {props.managements < 10 ? `0${props.managements}` : props.managements}
            </span>
          </Link>
          <Link
            className="statistic-element"
            to={`/livestock/results/${localStorage.getItem('entityId')}#weighing`}
          >
            <Typography variant="display2">{props.i18n.weighing}</Typography>
            <span className="statistic-element-number number-prod">
              {props.weighing < 10 ? `0${props.weighing}` : props.weighing} <span style={{fontSize: 'x-large'}}>Kg</span>
            </span>
          </Link>
          {props.production && props.productionUnit ? (
            <Link
              className="statistic-element"
              to={`/livestock/results/${localStorage.getItem('entityId')}#production`}
            >
              <Typography variant="display2">{props.i18n.production}</Typography>
              <span className="statistic-element-number number-prod">
                {props.production} <span style={{fontSize: 'x-large'}}>{props.productionUnit}</span>
              </span>
            </Link>
          ) : (
            <Link
              className="statistic-element"
              smooth 
              to={`/livestock/users/${localStorage.getItem('entityId')}`}
            >
              <Typography variant="display2">{props.i18n.workers}</Typography>
              <span className="statistic-element-number">
                {props.users < 10 ? `0${props.users}` : props.users}
              </span>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EntityGeneralStatisticsCard;
