import React from 'react';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/pt';
import events from '../events';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

const Calendar = (props) => (
    <BigCalendar
      style={{height: 500}}
      selectable
      events={events}
      defaultView={BigCalendar.Views.MONTH}
      scrollToTime={new Date(1970, 1, 1, 6)}
      defaultDate={new Date()}
      onSelectEvent={event => alert(event.title)}
      messages={{'today': "Hoje", "previous":"Anterior", "next":"Próximo", "month":"Mês", "week": "Semana", "day": "Dia", "agenda": "Agenda"}}
      onSelectSlot={slotInfo =>
        alert(
          `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
            `\nend: ${slotInfo.end.toLocaleString()}` +
            `\naction: ${slotInfo.action}`
        )
      }
    />
)

export default Calendar;