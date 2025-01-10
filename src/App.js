import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Login from './pages/Login';
import Registry from './pages/Registry';

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Editor" element={<Editor />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registry" element={<Registry />} />
      </Routes>
    </Router>
  );
}

export default App;