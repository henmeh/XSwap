import React from "react";
// Style
import { GlobalStyle } from "./GlobalStyle";
// Routing
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Components
import Header from "./components/Header/header";
import NavBar from "./components/NavBar/navbar";
import Footer from "./components/Footer/footer";
// Views
import Home from "./views/HomeView/home";
import MyXSwaps from "./views/MyXSwapsView/myxswaps";
// Hook
import { useLogInState } from "./hooks/useLogInState";

import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 70px 50px 1fr 10px;
  min-height: 97vh;
`;

const App = () => {
  //the state concering the user is logged in or not will be set in the parent component of navbar and body. So they both share the same state in terms of user loggin
  const { state: user, LogIn, LogOut } = useLogInState();

  return (
    <Wrapper>
      <Router>
        <Header user={user} LogIn={LogIn} LogOut={LogOut} />
        <NavBar />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/myXSwaps" element={<MyXSwaps user={user} />} />
        </Routes>
        <Footer />
        <GlobalStyle />
      </Router>
    </Wrapper>
  );
};

export default App;
