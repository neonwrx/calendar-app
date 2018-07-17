import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addEvent } from '../actions';
import { Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  ListGroup,
  ListGroupItem } from 'reactstrap';
import moment from 'moment';
import './Calendar.css';

// import Day from './Day';
// moment.locale('ru');

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      month: moment().month(),
      startDay: moment().clone().startOf('month'),
      endDay: moment().clone().endOf('month'),
      modal: false,
      nestedModal: false,
      currentId: '',
      event: '',
      eventChanged: '',
      eventChangedIndex: '',
      error: '',
    };

    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.addNewEvent = this.addNewEvent.bind(this);
    this.saveChangedEvent = this.saveChangedEvent.bind(this);
  }
  renderTable() {
    let calendar = [];
    const startDay = this.state.startDay;
    const endDay = this.state.endDay;

    let date = startDay.clone().subtract(1, 'day');

    while (date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7).fill(0).map(() => date.add(1, 'day').clone())
      })
    }

    return Object.keys(calendar).map(key => {
      return calendar[key].days.map((day, index) => {
        if (startDay.month() === day.month()) {
          return (
            // <Day day={day} key={index} onDayClick={(e, day)} />
            <div
              className="calendarDay"
              key={index}
              onClick={e => this.onDayClick(e, day)}
            >
              {day.date()}
            </div>
          );
        } else return null;
      });
    });
  }

  showEmptyDays() {
    return [...Array(this.state.startDay.day())].map((x, i) => {
      if (this.state.startDay.day() !== 0) {
        return <div className="calendarDay" key={Math.floor(Math.random()*10000)}></div>;
      } else return null;
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
      event: ''
    });
  }

  toggle2() {
    this.setState({
      nestedModal: !this.state.nestedModal
    });
  }

  onDayClick(e, day) {
    // console.log('Date!',day);
    this.setState({
      modal: !this.state.modal,
      currentId: day.format('YYYY-MM-DD')
    });
  }

  onInputChange(e) {
    this.setState({
      event: e.target.value,
      error: ''
    });
  }

  onInputChange2(e) {
    this.setState({
      eventChanged: e.target.value,
      error: ''
    });
  }

  addNewEvent() {
    if (this.state.event.trim().length > 0) {
      const events = (this.props.events.hasOwnProperty(this.state.currentId)) ? [...this.props.events[this.state.currentId], this.state.event] : [this.state.event];
      this.props.addEvent(this.state.currentId, events);
      this.setState({
        event: '',
        error: ''
      });
    } else {
      this.setState({error: 'Field must not be empty!'});
    }
  }

  editEvent(index) {
    this.setState({
      nestedModal: !this.state.nestedModal,
      eventChanged: this.props.events[this.state.currentId][index],
      eventChangedIndex: index
    });
  }

  deleteEvent(index) {
    let newEvents = this.props.events[this.state.currentId].slice();
    newEvents.splice(index, 1);
    this.props.addEvent(this.state.currentId, newEvents);
  }

  saveChangedEvent() {
    if (this.state.eventChanged.trim().length > 0) {
      let events = this.props.events[this.state.currentId].slice();
      events.splice(this.state.eventChangedIndex, 1, this.state.eventChanged);
      this.props.addEvent(this.state.currentId, events);
      this.setState({
        nestedModal: !this.state.nestedModal,
        eventChanged: '',
        eventChangedIndex: '',
      });
    } else {
      this.setState({
        error: 'Field must not be empty!'
      });
    }
  }

  changeMonth(val) {
    if (moment().month(this.state.month + val).year() < this.state.year) {
      this.setState({year: this.state.year + val});
    }
    this.setState({
      month: this.state.month + val,
      startDay: moment().month(this.state.month + val).clone().startOf('month'),
      endDay: moment().month(this.state.month + val).clone().endOf('month'),
    });
  }

  render() {
    const daysOfWeek = ['Sun','Mon','Tue','Wen','Thu','Fri','Sat'];
    return(
      <div style={{marginTop: '20px'}}>
        <Container>
          <h2>{moment().month(this.state.month).format('MMMM')}, {this.state.year}</h2>
          <br/>
          <Button outline size="sm" onClick={() => this.changeMonth(-1)}>Prev</Button>{' '}
          <Button outline size="sm" onClick={() => this.changeMonth(1)}>Next</Button>
          <div className="calendarContainer">
            {daysOfWeek.map((day, index)=>{
              return (
                <div className="calendarDay" key={index}>
                  <b>{day}</b>
                </div>
              )
            })}
            {this.showEmptyDays()}
            {this.renderTable()}
          </div>
        </Container>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop={true}>
          <ModalHeader toggle={this.toggle}>List of events for {this.state.currentId}</ModalHeader>
          <ModalBody>
            <ListGroup>
              {
                (this.props.events[this.state.currentId]) ?
                  this.props.events[this.state.currentId].map((event, index) => {
                    return  <ListGroupItem
                              key={index}
                              className="d-flex justify-content-between align-items-center"
                            >
                              {event}
                              <div className="d-flex justify-content-between align-items-center">
                                <Button className="edit-btn" size="sm" outline onClick={this.editEvent.bind(this, index)}>Edit</Button>{'  '}
                                <Button className="close" onClick={this.deleteEvent.bind(this,  index)}><span aria-hidden="true" >&times;</span></Button>
                              </div>
                            </ListGroupItem>
                  })
                : null
              }
            </ListGroup>
            <br/>
            <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested} backdrop={true}>
              <ModalHeader toggle={this.toggle2}>Edit event</ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Input
                    type="text"
                    name="text2"
                    id="exampleText2"
                    value={this.state.eventChanged}
                    onChange={(event) => this.onInputChange2(event)}
                  />
                  <p className="text-danger">{this.state.error}</p>
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.saveChangedEvent}>Change</Button>{' '}
              </ModalFooter>
            </Modal>
            <Form>
              <FormGroup>
                <Label for="exampleText">Add new event:</Label>
                <Input
                  type="text"
                  name="text1"
                  id="exampleText"
                  value={this.state.event}
                  onChange={(event) => this.onInputChange(event)}
                />
                <p className="text-danger">{this.state.error}</p>
              </FormGroup>
              <Button color="primary" outline size="sm" onClick={this.addNewEvent}>Add</Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({events}) {
  return {
    events
  };
}

export default connect(mapStateToProps, {addEvent})(Calendar);
