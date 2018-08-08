import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Button } from 'material-ui';

const FirstUseCard = (props) => {
    return (
        <Card className="first-use-card"> 
            <CardContent>
                <div><i className="material-icons first-use-card-content">domain</i></div>
                <p className="first-use-card-content">{props.step}</p>
                <Link to={props.route}>
                    <Button color="primary" variant="raised" className="first-use-card-content">
                        {props.buttonText}
                    </Button>
                </Link>
            </CardContent> 
        </Card>
    );
}

export default FirstUseCard;