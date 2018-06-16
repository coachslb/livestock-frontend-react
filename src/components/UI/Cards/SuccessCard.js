import React from 'react';
import { Paper, Typography } from 'material-ui';

const SuccessCard = ({elevation, style, title, titleVariant, titleComponent, text, textComponent, textVariant}) => {
    return(
        <Paper elevation={elevation} style={style}>
            <Typography variant={titleVariant} component={titleComponent}>
                {title}
            </Typography>
            <Typography component={textComponent} variant={textVariant}>
                {text}
            </Typography>
        </Paper>
    );
}

export default SuccessCard;