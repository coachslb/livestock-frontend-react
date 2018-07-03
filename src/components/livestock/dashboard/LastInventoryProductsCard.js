import React from 'react';
import { Card, CardContent, Typography } from 'material-ui';

const LastInventoryProductsCard = (props) => {
    return (
        <Card className="statistics-card"> 
            <CardContent>
                <Typography variant="title" color="primary">Inventário</Typography>
            </CardContent> 
        </Card>
    );
}

export default LastInventoryProductsCard;