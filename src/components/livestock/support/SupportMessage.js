import React from 'react';
import { Card } from 'material-ui';
import { formatDate } from '../../utils/dateUtils';

const SupportMessage = (props) => {
    return(
        <Card className="card-support-message-history">
            <p style={{margin: "10px 10px"}}>{props.message.message}</p>
            <span className="card-support-createdBy">{`${formatDate(props.message.date)} ${props.i18n.by} ${props.message.username}`}</span>
        </Card>
    )
}
export default SupportMessage;