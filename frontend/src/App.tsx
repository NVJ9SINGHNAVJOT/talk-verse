import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import OpenRoute from '@/components/auth/OpenRoute';
import MainNavbar from '@/components/common/MainNavbar';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import About from '@/pages/About';
import Login from '@/pages/Login';
import Individual from '@/components/talk/Individual';
import Group from '@/components/talk/Group';
import Error from '@/pages/Error';
import Talk from '@/pages/Talk';
import Welcome from "@/components/talk/Welcome";

function App() {

  return (
    <div className='w-screen overflow-y-auto overflow-x-hidden'>
      <MainNavbar />

      {/* all pages will be rendered below */}
      <div className='w-screen h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden'>

        <Routes>

          <Route path='/about' element={<About />} />
          <Route path='/' element={<Home />} />

          {/* open routes */}
          <Route element={<OpenRoute />}>
            <Route path='/login' element={<Login />} />
          </Route>

          {/* private routes */}
          <Route element={<PrivateRoute><Talk /></PrivateRoute>}>
            <Route path='/talk' element={<Welcome />} />
            <Route path='/talk/chat/:chatId?' element={<Individual />} />
            <Route path='/talk/group/:groupId?' element={<Group />} />
          </Route>

          <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* error route */}
          <Route path='*' element={<Error />} />

        </Routes>

      </div>

    </div>

  );
}

export default App;