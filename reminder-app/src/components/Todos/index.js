import {useState, useEffect} from "react"
import Header from "../Header";
import Cookies from "js-cookie";
import {v4 as uuidv4} from "uuid"
import Loader from "react-loader-spinner";
import {LoadingViewContainer} from "../HomePage/styledComponents";
import "./index.css"

const apiStatusConstants = {
    initial: "INITIAL",
    inProgress: "IN_PROGRESS",
    success: "SUCCESS",
    failure: "FAILURE",
};

const Todos = () => {
    const [todosApiRes,setTodosApi] = useState({status: apiStatusConstants.initial,data: null,errorMsg: null})
    const [userTodo, setUserTodo] = useState("")
    const getTodos =  async() => {
        setTodosApi(prevState =>( {...prevState,
          status: apiStatusConstants.inProgress,
          data: null,
          errorMsg: null,}
        ));
        const jwtToken = Cookies.get("jwt_token")
        const url = `http://localhost:3001/my-todos`;
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
            setTodosApi((prevState) => ({...prevState,
            status: apiStatusConstants.success,
            data: responseData,
          }));
          
        } else {
            setTodosApi((prevState) => ({...prevState,
            status: apiStatusConstants.failure,
            errorMsg: responseData.error_msg,}
          ));
        }
      };
    

    useEffect(() => {
        getTodos()
    },[])

    const onClickDelete = async(e) => {
        const todoId = e.target.id
        console.log(todoId)
        const jwtToken = Cookies.get("jwt_token")
        const url = `http://localhost:3001/todos/${todoId}`;
        const option = {
            method : "DELETE",
            headers : {
                "Content-type" : "applicaton/json",
                "Authorization" : `Bearer ${jwtToken}`
            }
        }
        const response = await fetch(url,option);
        if (response.ok) {
            const {data} = todosApiRes
            const {todos,user} = data
            const newTodos = todos.filter(each => each.id !== todoId)
            setTodosApi(prev => ({
                ...prev,data :{todos: newTodos, user}
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

    const statusUpdate = async(e) => {
        const todoId = e.target.id
        const value = e.target.value
        console.log("v,t",value,todoId)
        const jwtToken = Cookies.get("jwt_token")
        const url = `http://localhost:3001/todo-update-${value}/${todoId}`;
        const option = {
            method : "PUT",
            headers : {
                "Content-type" : "applicaton/json",
                "Authorization" : `Bearer ${jwtToken}`
            }
        }
        const response = await fetch(url,option);
        if (response.ok) {
            
            const {data} = todosApiRes
            const {todos} = data
            setTodosApi(prev => (  {
                ...prev,data : {...prev.data, todos : todos.map(each =>{
                    if (each.id === todoId) {
                        return {...each, status : value}
                    }
                    return each
                }
                 )}
            }))
        }else {
            alert("OOPS! SOMETHING WENT WRONG")
        }
    }
 
    const renderSuccessView = () => {
        
        const {data} = todosApiRes
        const {todos} = data
        
        
        console.log("rendersucess")
        return (
          <div className="">
            <h4>YOUR Todos</h4>
            {todos.length > 0 ? (
              <ul className="todo-ul">
                {todos.map(each => (
                  <li key={each.id} className="list-item-home d-flex flex-row align-items-center">
                    <h5 className={each.status==="pending" ? "reminder-task m-1":"todo-completed reminder-task m-1" }>{each.todo.toUpperCase()}</h5>
                    <div className="d-flex flex-row">
                        {each.status === "pending" ? (<button type="button" className="pending-button align-self-stretch" onClick={statusUpdate} value="complete" id={each.id}>Pending</button>) : (<button type="button" className="completed-button align-self-stretch" onClick={statusUpdate} value="pending" id={each.id}>Finished</button>)}
                        <button type="button" className="done-button align-self-stretch" id={each.id} onClick={onClickDelete}>DELETE</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
                <div className="height d-flex flex-row justify-content-center align-items-center">
                    <h5>LOOKS LIKE YOU HAVE NO TODOS</h5>
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
    const onChangeUserInput = (e) => {
        setUserTodo(e.target.value)
    }

    const renderViews = () => {
      
        const { status } = todosApiRes;
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
    


    const onClickAdd = async() => {
        if (userTodo !== "") {
            const id = uuidv4()
            const newTodo = {id,userTodo}
            const jwtToken = Cookies.get("jwt_token")
            const url = "http://localhost:3001/make-todo"
            const option = {
                method : "POST",
                headers : {
                    'Content-Type': 'application/json',
                    "Authorization" : `Bearer ${jwtToken}`
                },
                body : JSON.stringify(newTodo)
            }
            const response = await fetch(url, option)
            if (response.ok === true) {
                alert(`${userTodo} added succesfully`)
                const newUserTodo = {id,todo:userTodo,status : "pending"}
                const {todos} = todosApiRes.data
                setTodosApi(prev => ({
                    ...prev,data : {...prev.data, todos : [...todos, newUserTodo]}
                  }))
            }
        }else {
            alert("PLEASE GIVE AN VALID INPUT")
        }
        
    }

    return (
        <div>
            <Header />
            <div>
                <h3>Add New Todo Here</h3>
                <div className="d-flex flex-row justify-content-center">
                <input type="text" onChange={onChangeUserInput} value={userTodo} className="todo-input" />
                <button type="button" onClick={onClickAdd} className="btn btn-outline-secondary">ADD</button>
                </div>
                {renderViews()}
            </div>
        </div>
    )
}

export default Todos