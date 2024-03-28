import { useNavigate } from "react-router-dom";

const MainNavbar = () => {

  const navigate = useNavigate()
  const homeHandler = () => {
    navigate("/")
  }
  const loginHandler = () => {
    navigate("/login")
  }
  
  return (

  <div>
    MainNavbar
  </div>    


  )
}

export default MainNavbar