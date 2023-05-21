import {useState, useEffect} from "react"
import Header from "../Header";
import Cookies from "js-cookie";
import Loader from "react-loader-spinner";
import {LoadingViewContainer} from "../HomePage/styledComponents";
import "./index.css"

const apiStatusConstants = {
    initial: "INITIAL",
    inProgress: "IN_PROGRESS",
    success: "SUCCESS",
    failure: "FAILURE",
};

const RemindersPage = () => {
    const [remindersApires,setRemindersApi] = useState({status: apiStatusConstants.initial,data: null,errorMsg: null})
    
    const getReminders =  async() => {
        setRemindersApi(prevState =>( {...prevState,
          status: apiStatusConstants.inProgress,
          data: null,
          errorMsg: null,}
        ));
        const jwtToken = Cookies.get("jwt_token")
        const url = `http://localhost:3001/my-reminders`;
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
          setRemindersApi((prevState) => ({...prevState,
            status: apiStatusConstants.success,
            data: responseData,
          }));
          
        } else {
          setRemindersApi((prevState) => ({...prevState,
            status: apiStatusConstants.failure,
            errorMsg: responseData.error_msg,}
          ));
        }
      };
    

    useEffect(() => {
        getReminders()
    },[])

    const onClickDelete = async(e) => {
        const reminderId = e.target.id
        console.log(reminderId)
        const jwtToken = Cookies.get("jwt_token")
        const url = `http://localhost:3001/reminders/${reminderId}`;
        const option = {
            method : "DELETE",
            headers : {
                "Content-type" : "applicaton/json",
                "Authorization" : `Bearer ${jwtToken}`
            }
        }
        const response = await fetch(url,option);
        if (response.ok) {
            const {data} = remindersApires
            const {reminders,user} = data
            const newReminders = reminders.filter(each => each.id !== reminderId)
            setRemindersApi(prev => ({
                ...prev,data :{reminders: newReminders, user}
            }))
        }else {
            alert("OOPS! SOMETHING WENT WRONG")
        }

    }

    const renderLoadingView = () => (
        <LoadingViewContainer>
            <Loader type="ThreeDots" color="pink" height="50" width="50" />
        </LoadingViewContainer>
    );
 
    const renderSuccessView = () => {
        
        const {data} = remindersApires
        const {reminders} = data
        
        
        console.log("rendersucess")
        return (
          <div className="home-container">
            <h1>YOUR REMINDERS</h1>
            {reminders.length > 0 ? (
              <ul className="rem-ul">
                {reminders.map(each => (
                  <li key={each.id} className="list-item-home d-flex flex-row align-items-center">
                    <h5 className="reminder-task m-1">{each.reminder.toUpperCase()}</h5>
                    <p className="m-1">{new Date(each.time).toLocaleString()}</p>
                    <button type="button" className="done-button align-self-stretch" id={each.id} onClick={onClickDelete}>DELETE</button>
                  </li>
                ))}
              </ul>
            ) : (
                <div className="height d-flex flex-row justify-content-center align-items-center">
                    <h5>LOOKS LIKE YOU HAVE NO REMINDERS ATALL</h5>
                </div>
            )}
          </div>
        )
      }
    
      const renderFailureView = () => {
        return(
            <div className="height d-flex flex-row justify-content-center align-items-center">
            <h1>OPPS! SOMETHING WENT WRONG</h1>
            </div>
        )
      }

    const renderViews = () => {
      
        const { status } = remindersApires;
        console.log("satus", status)
        switch (status) {
        case apiStatusConstants.inProgress:
            return renderLoadingView();
        case apiStatusConstants.success:
            return renderSuccessView();
        case apiStatusConstants.failure:
            return renderFailureView();
        default:
            return null;
        }
      }

    return (
        <div>
            <Header />
            <div>
                {renderViews()}
            </div>
        </div>
    )
}

export default RemindersPage