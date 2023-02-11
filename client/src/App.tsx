import React from 'react';
import { Routes, Route } from "react-router-loading";
//import { NftList } from './NftList';
import { Home } from './pages/Home';
import { Trade } from './pages/Trade';
import { Profile } from './pages/Profile';
import { Register } from './pages/Register';
import { Container } from './styles/GlobalStyles';

function App() {
  return (
    <Routes>
      <Container>
        <Route path="/" element={<Home />} />
        <Route path="trade" element={<Trade />} />
        <Route path="profile" element={<Profile />} />
        <Route path="register" element={<Register />} />
      </Container>
    </Routes>
  );

}

export default App;
