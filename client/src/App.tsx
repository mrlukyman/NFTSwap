import React from 'react';
import { Routes, Route } from "react-router-loading";
//import { NftList } from './NftList';
import { Home } from './pages/Home';
import { Trade } from './pages/Trade';
import { Container } from './styles/GlobalStyles';

function App() {
  return (
    <Routes>
      <Container>
        <Route path="/" element={ <Home/> } />
        <Route path="trade" element={ <Trade/> } loading />
      </Container>
    </Routes>
  );
  
}

export default App;
