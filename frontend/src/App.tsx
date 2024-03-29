import {Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import OpenRoute from '@/components/auth/OpenRoute';
import MainNavbar from '@/components/common/MainNavbar';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import About from '@/pages/About';
import Login from '@/pages/Login';
import Chat from '@/pages/Chat';
import Group from '@/pages/Group';
import Error from '@/pages/Error';


function App() {
  return (
    <div className='w-screen h-screen overflow-y-auto'>
      <MainNavbar/>

      {/* all pages will be rendered below navbar */}
      <div className='w-full'>
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
            <Route path='/dashboard/group/:groupId' element= {<Group/>}/>
          </Route>
          
          {/* error route */}
          <Route path='*' element= {<Error/>}/>

        </Routes>
      </div>
      
    </div>
  );
}

export default App;