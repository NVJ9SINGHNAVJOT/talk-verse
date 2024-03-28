import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material"
import { navbar } from "@src/constants/color";
import { useNavigate } from "react-router-dom";


const Navbar = () => {

  const navigate = useNavigate()
  const homeHandler = () =>{
    navigate("/")
  }
  const loginHandler = () =>{
    navigate("/login")
  }
  return (
    <Container component="div" className="w-full h-[4rem]">
      
  
      <AppBar component="nav" style={navbar}
        
      >
        <Toolbar className="flex justify-evenly">

          <Typography
            className="cursor-pointer"
            variant="h6"
            component="div"
            onClick={homeHandler}
          >
            TalkVerse
          </Typography>


          <Box>
              <Button onClick={homeHandler}  sx={{ color: '#fff' }}>
                Home  
              </Button>

              <Button  sx={{ color: '#fff' }}>
                About
              </Button>
    
              <Button  sx={{ color: '#fff' }}>
                Contact
              </Button>
      
              <Button onClick={loginHandler} sx={{ color: '#fff' }}>
                Log In
              </Button>
          </Box>


        </Toolbar>
      </AppBar>
    
      

    </Container>
  )
}

export default Navbar