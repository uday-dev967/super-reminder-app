import { NavLink, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import {AiOutlineLogout,AiFillHome} from "react-icons/ai"
import {IoNotificationsCircleOutline} from "react-icons/io5"
import {MdOutlineNotificationsActive} from "react-icons/md"
import {SiTodoist} from "react-icons/si"
import "./index.css"

const Header = (props) => {
    
    const navigate = useNavigate()
    const onClickAppIcon = () => {
        
        navigate("/home")
    }

    const onLogOUt = () => {
        Cookies.remove('jwt_token')
        navigate("/")
    }

    const toHome = () => {
        navigate("/home")
    }

    const toReminder = () => {
        navigate("/reminders")
    }

    const toTodo = () => {
        navigate("/todos")
    }
    

    return(
    <nav className="container-fluid header-main-container ">
        <div className="row d-flex flex-row justify-content-between pt-1 pb-1  header-back-container">
            <div className="col-2 d-flex d-md-none">
            <IoNotificationsCircleOutline onClick={onClickAppIcon} style={{color: "pink"}} size={"50px"}/>
            </div>

            <div className="col-3 d-md-flex d-none" onClick={onClickAppIcon}>
            <IoNotificationsCircleOutline className="app-icon" style={{color: "pink"}} />
            <h1 className="header-title">SUPER REMINDER</h1>
            </div>
        
        <div className="col-9 d-flex flex-row justify-content-end">
        
        <div className="nav-links-container">
            
            <AiFillHome onClick={toHome} style={{color : "pink"}} size={"25px"} />
            <MdOutlineNotificationsActive onClick={toReminder} style={{color : "pink"}} size={"25px"} />
            <SiTodoist onClick={toTodo}  style={{color : "pink"}} size={"22px"} />
            <AiOutlineLogout onClick={onLogOUt} style={{color : "orange"}} size={"25px"} />
            
        </div>
        <div className="nav-links-md-container">
            <NavLink to="/home" className={(isActive, isPending) => isPending ? "pending" : isActive ? "active" : ""} >Home</NavLink>
            <NavLink to="/reminders" className={(isActive, isPending) => isPending ? "pending" : isActive ? "active" : ""}>Reminders</NavLink>
            <NavLink to="/todos" className={(isActive, isPending) => isPending ? "pending" : isActive ? "active" : ""}>Todos</NavLink>
            <button className="btn btn-outline-danger" onClick={onLogOUt} type="button">LOGOUT</button>
        </div>
        </div>
        
        </div>
    </nav>
)}

export default Header