import { lazy } from 'react';
import {Routes, Route } from 'react-router-dom';

const Home = lazy(() => import("./pages/Home"))
const About = lazy(() => import("./pages/About"))
const Login = lazy(() => import("./pages/Login"))
const Chat = lazy(() => import("./pages/Chat"))
const Groups = lazy(() => import("./pages/Groups"))

function App() {
  return (
    <div className='appScreen'>
      <Routes>
        <Route path='/' element= {<Home/>}/>
        <Route path='/about' element= {<About/>}/>
        <Route path='/login' element= {<Login/>}/>
        <Route path='/chat/:chatId' element= {<Chat/>}/>
        <Route path='/groups' element= {<Groups/>}/>
      </Routes>
    </div>
  );
}

export default App;