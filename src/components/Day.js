import React, { Component } from 'react';

class Day extends Component {
  render() {
    const { day, onDayClick } = this.props;
    return (
      <div
        className={(this.props.events[day.format('YYYY-MM-DD')] && this.props.events[day.format('YYYY-MM-DD')].length > 0) ? 'calendarDay active' : 'calendarDay'}
        onClick={onDayClick}
      >
        {day.date()}
      </div>
    );
  }
}

export default Day;
