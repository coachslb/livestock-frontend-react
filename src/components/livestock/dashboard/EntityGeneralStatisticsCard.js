import React from 'react';
import { Card, CardContent, Typography } from 'material-ui';

const EntityGeneralStatisticsCard = props => {
  return (
    <Card className="statistics-card">
      <CardContent>
        <Typography variant="title" color="primary">
          Dados da entidade
        </Typography>
        <div className="statistics-data">
          <p className="statistic-element">
            <span className="statistic-element-number">
              {props.explorations < 10 ? `0${props.explorations}` : props.explorations}
            </span>{' '}
            Explorações
          </p>
          <p className="statistic-element">
            <span className="statistic-element-number">
              {props.places < 10 ? `0${props.places}` : props.places}
            </span>{' '}
            Locais
          </p>
          <p className="statistic-element">
            <span className="statistic-element-number">
              {props.animals < 10 ? `0${props.animals}` : props.animals}
            </span>{' '}
            Animais
          </p>
          <p className="statistic-element">
            <span className="statistic-element-number">
              {props.managements < 10 ? `0${props.managements}` : props.managements}
            </span>{' '}
            Atividades
          </p>
          <p className="statistic-element">
            <span className="statistic-element-number">
              {props.users < 10 ? `0${props.users}` : props.users}
            </span>{' '}
            Trabalhadores
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EntityGeneralStatisticsCard;
