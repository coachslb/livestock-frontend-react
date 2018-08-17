import React from 'react';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/pt';
// import events from '../events';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

const Calendar = props => (
  <BigCalendar
    style={{ height: 500 }}
    selectable
    events={props.tasks}
    defaultView={BigCalendar.Views.MONTH}
    scrollToTime={new Date(1970, 1, 1, 6)}
    defaultDate={new Date()}
    onSelectEvent={event => props.showTaskDetail(event)}
    messages={{
      today: props.i18n.task.calendar.today,
      previous: props.i18n.task.calendar.previous,
      next: props.i18n.task.calendar.next,
      month: props.i18n.task.calendar.month,
      week: props.i18n.task.calendar.week,
      day: props.i18n.task.calendar.day,
      agenda: props.i18n.task.calendar.agenda,
    }}
    eventPropGetter={(event, start, end, isSelected) => {
      let newStyle = {
        backgroundColor: 'lightgrey',
        color: 'black',
        borderRadius: '0px',
        border: 'none',
      };

      // eslint-disable-next-line
      if (event.target == localStorage.getItem('workerId')) {
        newStyle.backgroundColor = 'primary';
      }

      return {
        className: '',
        style: newStyle,
      };
    }}
    onSelectSlot={event => { props.addNewTask(event)}}
    /* slotInfo =>alert(
        `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
          `\nend: ${slotInfo.end.toLocaleString()}` +
          `\naction: ${slotInfo.action}`,
      ) 
    } */
  />
);

export default Calendar;
