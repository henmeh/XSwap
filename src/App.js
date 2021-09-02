import React from 'react';
// Style
import { GlobalStyle } from './GlobalStyle';
// Routing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Header
import Header from './components/Header/header';
import Home from './components/Home';
// Hook
import { useLogInState } from './hooks/useLogInState';

const App = () => {
  //the state concering the user is logged in or not will be set in the parent component of navbar and body. So they both share the same state in terms of user loggin
  const { state: user, LogIn, LogOut } = useLogInState();

  return (
    <Router>
      <Header user={user} LogIn={LogIn} LogOut={LogOut}/>
      <Routes>
        <Route path="/" element={<Home user={user}/>} />
      </Routes>
      <GlobalStyle />
    </Router>
  );
};

export default App;
