import React from 'react';
import { Card, CardContent, Typography } from 'material-ui';
import './dashboard.css';

const WelcomeCard = (props) => {
    return (
        <Card className="welcome-card">
            <CardContent className="welcome-card-container">
                <Typography variant="display1" className="welcome-card-typography" color="primary"><strong>Bem-vindo à Agroop Livestock</strong></Typography>
                <Typography variant="subheading" className="welcome-card-typography center">É uma aplicação que lhe permitirá gerir a sua exploração de forma mais intuitiva, 
                simples, moderna, eficiente e cool... </Typography>
                <Typography variant="body1" className="welcome-card-typography center">Caso tenha alguma dúvida contacte-nos na secção de suporte!!!<br/>Boa gestão ;)</Typography>
            </CardContent>
        </Card>
    );
}

export default WelcomeCard;