import {BrowserRouter,Routes,Route} from "react-router-dom"
import RegisterPage from "./components/RegisterPage"
import MainPage  from "./components/MainPage";
import HomePage from "./components/HomePage"
import './App.css';
import LoginPage from "./components/LoginPage";
import RemindersPage from "./components/RemindersPage";
import Todos from "./components/Todos";
import ProtectedRoute from "./components/ProtectedRoute"
import NotFound from "./components/NotFound";

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<MainPage />} />
      <Route exact path="/register" element={<RegisterPage />} />
      <Route exact path="/login" element={<LoginPage />} />
      <Route path="/"  element={<ProtectedRoute />}>
        <Route exact path = "/home" element={<HomePage />} />
        <Route exact path="/reminders" element={<RemindersPage />}/>
        <Route exact path="/todos" element={<Todos />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
   </BrowserRouter>
  );
}

export default App;
