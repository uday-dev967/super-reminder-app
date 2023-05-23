import { Component } from "react";
import Loader from "react-loader-spinner";
import {v4 as uuidv4} from "uuid"
import Header from "../Header"
import "./index.css"
import {LoadingViewContainer} from "./styledComponents";
import Cookies from "js-cookie";

const apiStatusConstants = {
    initial: "INITIAL",
    inProgress: "IN_PROGRESS",
    success: "SUCCESS",
    failure: "FAILURE",
};

const apiBaseUrl = "http://localhost:3001"
const clearList = []

class HomePage extends Component {
  state = {remindersApiRes : {status: apiStatusConstants.initial,data: null,errorMsg: null},alertdList: [],userReminder:"",userTime : ""}
   
  

  onchangeUserReminder = (e) => {
  this.setState({userReminder : e.target.value})
  }

  onChangeUserTime = (e) => {
    this.setState({userTime : e.target.value})
  }



  

  onClickAdd = async() => {
      const {userReminder,userTime} = this.state
      if (userReminder === "" || userTime === "") {
        alert("PLEASE GIVE VALID INPUTS")
      }
      else {
        const id = uuidv4()
        const {userReminder, userTime} = this.state
        const newReminder = {userReminder,userTime,id}
        const jwtToken = Cookies.get("jwt_token")
        
        console.log(userReminder, userTime)
        const url = `${apiBaseUrl}/make-reminder`
        const option = {
          method : "POST",
          headers : {
              'Content-Type': 'application/json',
              "Authorization" : `Bearer ${jwtToken}`
          },
          body : JSON.stringify(newReminder)
      }
        const response = await fetch(url, option)
        if (response.ok === true) {
          alert(`${userReminder} added succesfully`)
          const neRem = {id,reminder:userReminder,time:userTime,status : "peding"}
          const timeDiff = new Date(userTime) - new Date()
          console.log(timeDiff)
          const timerId = setTimeout(() => {
            const {remindersApiRes} = this.state 
            const {data} = remindersApiRes
            const {reminders} = data
            this.setState(prev => ({remindersApiRes : {
              ...prev.remindersApiRes,data : {...prev.remindersApiRes.data, reminders : [...reminders, neRem]}
            }}))
          },timeDiff)
          clearList.push(timerId)
        }
        else {
          alert("OOPS! Something Went Wrong")
        }
        this.setState({userReminder : "", userTime : ""})
      }
    }
  
  

  getReminders =  async() => {
    this.setState(prevState =>( {
     remindersApiRes : {...prevState.remindersApiRes,
      status: apiStatusConstants.inProgress,
      data: null,
      errorMsg: null,}
    }));
    const jwtToken = Cookies.get("jwt_token")
    const url = `${apiBaseUrl}/my-reminders`;
    const option = {
      method : "GET",
      headers : {
          "Content-type" : "applicaton/json",
          "Authorization" : `Bearer ${jwtToken}`
      }
    }
    const response = await fetch(url,option);
    const responseData = await response.json();
    if (response.ok) {
      
      const {reminders,user} = responseData
      
      const newPastReminders = reminders.filter(each => each.status === "pending" && (new Date(each.time) - new Date()) <= 0 )
      const currData = {reminders : newPastReminders, user}
      this.setState((prevState) => ({
        remindersApiRes : {...prevState.remindersApiRes,
        status: apiStatusConstants.success,
        data: currData,}
      }));
      
      const newFutureReminders = reminders.filter(each => each.status === "pending" && (new Date(each.time) - new Date()) > 0 )
      newFutureReminders.forEach(each => {
        const timeDiff = new Date(each.time) - new Date()
        const {remindersApiRes} = this.state
        const {data} = remindersApiRes
        const {reminders} = data
        const clearTimerId = setTimeout(() => {
          this.setState(prev => ({remindersApiRes : {
            ...prev.remindersApiRes,data : {...prev.remindersApiRes.data, reminders : [...reminders, each]}
          }}))
        },timeDiff)
        clearList.push(clearTimerId)
      })
    
      
    } else {
      this.setState((prevState) => ({
        remindersApiRes :{...prevState.remindersApiRes,
        status: apiStatusConstants.failure,
        errorMsg: responseData.error_msg,}
      }));
    }
  };

  onClickDone = async(e) => {
    const reminderId = e.target.id
    console.log(reminderId)
    const jwtToken = Cookies.get("jwt_token")
    const url = `${apiBaseUrl}/reminders-update/${reminderId}`;
    const option = {
      method : "PUT",
      headers : {
          "Content-type" : "applicaton/json",
          "Authorization" : `Bearer ${jwtToken}`
      }
    }
    const response = await fetch(url,option);
    if (response.ok) {
      const {remindersApiRes} = this.state 
      const {data} = remindersApiRes
      const {reminders} = data
      const neRem = reminders.filter(each => each.id !== reminderId)
      const out = reminders.filter(each => each.id === reminderId)
      this.setState(prev => ({alertdList : [...prev.alertdList, ...out ]}))
      this.setState(prev => ({remindersApiRes : {
        ...prev.remindersApiRes,data : {...prev.remindersApiRes.data, reminders : [...neRem]}
      }}))
    }else {
      alert("OOPS! SOMETHING WENT WRONG")
    }
  }

    componentDidMount(){
        this.getReminders();
        console.log("component")
    }

    componentWillUnmount() {
      clearList.forEach(each => clearTimeout(each))
    }


  renderLoadingView = () => (
        <LoadingViewContainer>
          <Loader type="ThreeDots" color="pink" height="50" width="50" />
        </LoadingViewContainer>
      );

  renderSuccessView = () => {
        const {remindersApiRes, userReminder,userTime,alertdList} = this.state
        const {data} = remindersApiRes
        const {user,reminders} = data
        console.log("user reminders", reminders)
        let renderReminders = reminders.filter(each => (
          alertdList.every(eachAlrt => eachAlrt.id !== each.id)
        ))
        
        console.log("rendersucess")
        return (
          <div>
            <h1>Welcome,<span className="user">{user}</span></h1>
            <h4>Add Your Reminders Here</h4>
            <div className="reminder-adder-conatainer">
              <div className="label-input-home">
              <label className="label-home" htmlFor="reminder">Reminder</label>
              <input className="input-home input-width" type="text" id="reminder" value={userReminder} placeholder="Enter your reminder" onChange={this.onchangeUserReminder} />
              </div>
              <div>
              <label className="label-home" htmlFor="time">Time</label>
              <input className="input-home" type="datetime-local" id="time" value={userTime} onChange={this.onChangeUserTime} />
              <button className="add-button-home" onClick={this.onClickAdd}>ADD</button>
              </div>
              
            </div>
            <h4>Your Alerts</h4>
            {renderReminders.length > 0 ? (
              
              <ul className="home-ul">
                {renderReminders.map(each => (
                  <li key={each.id} className="list-item-home d-flex flex-row align-items-center">
                    <h5 className="reminder-task align-self-center">{each.reminder.toUpperCase()}</h5>
                    <button type="button" className="done-button align-self-stretch" id={each.id} onClick={this.onClickDone}>DONE</button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="height d-flex flex-row justify-content-center align-items-center">
                <h5>LOOKS LIKE YOU HAVE NO REMINDERS AT THE MOMENT</h5>
              </div>
            )}
          </div>
        )
      }

    renderFailureView = () => {
        return(
          <div className="height d-flex flex-row justify-content-center align-items-center">
            <h1>OPPS! SOMETHING WENT WRONG</h1>
          </div>
        )
      }

    rendreViews = () => {
      const {remindersApiRes} = this.state
        const { status } = remindersApiRes;
        console.log("satus", status)
        switch (status) {
        case apiStatusConstants.inProgress:
            return this.renderLoadingView();
        case apiStatusConstants.success:
            return this.renderSuccessView();
        case apiStatusConstants.failure:
            return this.renderFailureView();
        default:
            return null;
        }
      }
    render () {
      return (
          <div>
              <Header />
              <div className="home-container">
                  {this.rendreViews()}
                  
              </div>
          </div>
      )
    }
}

export default HomePage