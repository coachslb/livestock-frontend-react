import React from 'react';
import { Card, CardContent, Typography } from 'material-ui';

const LastManagementsCard = (props) => {
    return (
        <Card className="statistics-card"> 
            <CardContent>
                <Typography variant="title" color="primary">Últimos maneios</Typography>
            </CardContent> 
        </Card>
    );
}

export default LastManagementsCard;