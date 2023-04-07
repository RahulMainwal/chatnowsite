import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { ChatPage } from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/:id' element={<ChatPage />} />
      <Route path='/profile/:id' element={<ProfilePage />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
