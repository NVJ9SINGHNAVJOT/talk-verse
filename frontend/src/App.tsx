import {Routes, Route } from 'react-router-dom';
import "@src/App.css";
import PrivateRoute from '@src/components/auth/PrivateRoute';
import OpenRoute from '@src/components/auth/OpenRoute';
import Navbar from '@src/components/common/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Group from './pages/Group';
import Error from './pages/Error';


function App() {
  return (
    <div className='w-screen h-screen overflow-y-auto'>
      <Navbar/>

      {/* all pages will be rendered below navbar */}
      <div className='w-full h-[calc(100vh-4rem)]'>
        <Routes>

          <Route path='/about' element= {<About/>}/>
          <Route path='/' element= {<Home/>}/>

          {/* open routes */}
          <Route element = {<OpenRoute/>}>
            <Route path='/login' element= {<Login/>}/>
          </Route>
          
          {/* private routes */}
          <Route element= {<PrivateRoute><Dashboard/></PrivateRoute>}>
            <Route path='/dashboard/chat/:chatId' element= {<Chat/>}/>
            <Route path='/dashboard/group/:grouId' element= {<Group/>}/>
          </Route>
          
          {/* error route */}
          <Route path='*' element= {<Error/>}/>

        </Routes>
      </div>
      
    </div>
  );
}

export default App;