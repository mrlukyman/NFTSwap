import React from 'react';
import { Routes, Route } from "react-router-loading";
//import { NftList } from './NftList';
import { Home } from './pages/Home';
import { Trade } from './pages/Trade';
import { Profile } from './pages/Profile';
import { Container } from './styles/GlobalStyles';

function App() {
  return (
    <Routes>
      <Container>
        <Route path="/" element={<Home />} />
        <Route path="trade" element={<Trade />} />
        <Route path="profile" element={<Profile />} loading />
      </Container>
    </Routes>
  );

}

export default App;
