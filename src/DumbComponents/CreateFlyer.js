import React from 'react'
import { FormGroup, Form, ControlLabel, FormControl, Grid,Row, Col, PageHeader, Modal, Image } from 'react-bootstrap'
import { Button } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux'
import DatePicker from 'react-bootstrap-date-picker';
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { Link } from 'react-router';
import { createNew, uploadImages, update } from '../models/index.js';
import { ImageDropzone } from './ImageDropzone.js';
import { Flyer } from './Flyer';
import Logo from '../asset/logoHorizontal.png';
import { IDtoObject } from '../Commen/index.js';
import TimePicker from 'react-times';
import 'react-times/css/classic/default.css';


// import { AuthWrapper, ORG } from '../Commen'


class CreateFlyerPage extends React.Component {
  constructor (props) {
    super(props)
    this.onPreview = this.onPreview.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onClear = this.onClear.bind(this);
    this.getFlyer = this.getFlyer.bind(this)
    this.state = {
      active: true,
      success: false,
      show: false,
      likes: 0,
      name: "",
      date: new Date().toISOString(),
      time: "",
      description: "",
      location: "",
      files: [],
      minute: "",
      hour: "",
      timefocus: false,
    }
  }

  onClear(event){
    event.preventDefault();
    this.setState({ success: false, time: ""})

    findDOMNode(this.name).value = "";
    findDOMNode(this.description).value = "";
    findDOMNode(this.location).value = "";
  }


  onPreview(event){
    event.preventDefault();
    const name = findDOMNode(this.name).value;
    const description = findDOMNode(this.description).value;
    const location = findDOMNode(this.location).value;
    var imagesFiles = []
    if(this.refs.dropzone && this.refs.dropzone.state.files){
      imagesFiles = this.refs.dropzone.state.files
    }
    if(!imagesFiles.length)//file is not uploaded
     NotificationManager.error('Error', 'Please upload at least one image to preview', 2222);
     else{
    this.setState({
      show: true,
      location: location,
      name: name,
      description: description,
      files: imagesFiles
    })
   }
  }

  onCreate(event){
    event.preventDefault();
    const { uid } = this.props.user
    const clubID = uid;
    const { time } = this.state
    const flyer = {
      name: findDOMNode(this.name).value,
      description: findDOMNode(this.description).value,
      location: findDOMNode(this.location).value,
      date: this.state.date.substring(0,10),
      active: true,
      likes: 0,
      belongsTo: uid,
      time: time
    }

    var imagesFiles = this.refs.dropzone.state.files
    if(flyer.name === "")
      NotificationManager.error('Error', 'Please enter valid name!', 2222);
    else if(flyer.time === "")
      NotificationManager.error('Error', 'Please enter valid time!', 2222);
    else if(flyer.description === "")
      NotificationManager.error('Error', 'Please enter valid description!', 2222);
    else if(flyer.location === "")
      NotificationManager.error('Error', 'Please enter valid location!', 2222);
    else if(!imagesFiles.length)//file is not uploaded
      NotificationManager.error('Error', 'Please upload at least one image!', 2222);
    else{

      this.setState({ success: true})
      let flyerID = createNew('events',flyer)
      let flyerIDobj = IDtoObject(flyerID)
      // let uid = this.props.user.uid
      update(`users/${uid}/FlyersCreated`, flyerIDobj)

       // image uploading
       // let files = this.refs.dropzone.state.files
       uploadImages("events", flyerID, clubID, imagesFiles)

    }
  }

  onTimeChange(newtime) {
    if(this.state.timefocus){
      const [ hour, minute ] = newtime.split(':');
      this.setState({hour, minute, time:newtime})
    }
    else if(this.state.time2focus){
      const [ hour, minute ] = newtime.split(':');
      this.setState({hour, minute, time2:newtime})
    }
  }

  onFocusChange(newfocus) {
    this.setState({timefocus:newfocus})
  }
  onFocusChange2(newfocus) {
    this.setState({time2focus:newfocus})
  }
  timeTrigger(event){
    const focused = this.state.timefocus;
    this.setState({ timefocus: !focused });
  }

  timeTrigger2(event){
    const focused = this.state.time2focus;
    this.setState({ time2focus: !focused });
  }


  getFlyer () {
      var ourDate = this.state.date
      var date = (ourDate || new Date().toISOString() ).substring(0,10)
      const { name, location, description, likes, files, time } = this.state

      const flyerData = {
        name: name,
        location: location,
        description: description,
        date: date,
        time: time,
        images: files,
        likes: likes,
      }
      //console.log('this.refs?', imagesFiles)
          // <Col sm={12} md={12}>
        return(
          <Col sm={12} md={12}>
              <Flyer flyer={flyerData} />
          </Col>
        )
    }
        // <Panel key={this.state.name} bsStyle='success'
        //     header={this.state.name}>
        //   <h3>{this.state.name}</h3>
        //     <p>
        //       Date: {x} <br />
        //       Time: {this.state.time}<br />
        //       Description: {this.state.description}<br />
        //       Location: {this.state.location}
        //     </p>
        // </Panel>


  handleChange(value){
    this.setState({
      date: value,
    })
  }
//      formattedValue: (value || new Date().toISOString() ).substring(0,10)


  render() {
    return (
      <Grid>
        <Row className="header">
          <Col sm={12} md={8} mdOffset={2}>

          <PageHeader>Create Event <small>Name of club</small></PageHeader>
          </Col>
        </Row>
        <Row className="name">
          <Col sm={12} md={8} mdOffset={2}>
          <Form>
            <FormGroup>
              <ControlLabel>What is the name of your upcoming event?</ControlLabel>

              <FormControl
                type="text"
                placeholder="Enter name"
                ref={(node) => {this.name = node}}
              />
            </FormGroup>
          </Form>
          </Col>
        </Row>
        <Row className="time">
          <Col md={4} mdOffset={2}>
            <FormGroup >
              <ControlLabel>When will it take place?</ControlLabel>
              <DatePicker onChange={this.handleChange} value={this.state.date} />
            </FormGroup>
          </Col>
          <Col md={4} mdOffset={0.5}>
            <FormGroup>
              <ControlLabel>Time</ControlLabel>
                <TimePicker
                  theme="classic"
                  time={this.state.time}
                  onFocusChange={this.onFocusChange.bind(this)}
                  onTimeChange={this.onTimeChange.bind(this)}
                  focused={this.state.timefocus}
                  trigger={(
                    <FormControl
                      placeHolder="Please choose time"
                      value={this.state.time} onClick={this.timeTrigger.bind(this)}
                    />)}
                />
            </FormGroup>
          </Col>
        </Row>
        <br/>
        <Row className="location">
          <Col sm={12} md={8} mdOffset={2}>
          <Form>
            <FormGroup>
              <ControlLabel>Where is the new event going to be?</ControlLabel>
              <FormControl
                type="text"
                placeholder="Enter location"
                ref={(node) => {this.location = node}}
              />
              <FormControl.Feedback />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Please give students a detail description of your event</ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder="Enter description"
                ref={(node) => {this.description = node}}
              />
            </FormGroup>


            <ImageDropzone ref="dropzone"/>


          </Form>
        </Col>
      </Row>

      <br/>

      <Row className="newButton">
        <Col md={1} mdOffset={2}>
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={this.onCreate}>CreateFlyer
          </Button>
        </Col>

        <Col md={1} >
          <Button
            bsStyle="success"
            bsSize="small"
            onClick={this.onPreview}>
            Preview flyer page
          </Button>

          <Modal show={this.state.success} onHide={this.close}>

            <Modal.Body>
               <Modal.Title className='text-center' style={{color: 'blue'}}>
                  <div>Your flyer was successfully created!!!</div>
                </Modal.Title>
               <Image src={Logo} style={{marginTop:100}} responsive/>
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={this.onClear}>Create another flyer</Button>
              <Link className='btn' to='/' onClick={() => this.setState({success: false})}>
              Home Page</Link>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.show} onHide={this.close}>
          {/*}<Flyer flyer={this.state}/>*/}
            <Modal.Body>
                { this.getFlyer() }
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={() => this.setState({show: false})}>Close</Button>
            </Modal.Footer>
          </Modal>

        </Col>
      </Row>

      <NotificationContainer/>

    </Grid>


    );
  }
}


function mapStateToProps(state){
  return{
    user: state.user
  }
}
// const CreateFlyer = AuthWrapper(connect(mapStateToProps)(CreateFlyerPage), ORG)
const CreateFlyer = connect(mapStateToProps)(CreateFlyerPage)
export { CreateFlyer }
