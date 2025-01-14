import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.js';
import Home from './pages/Home.js';
import Editor from './pages/Editor.js';
import Login from './pages/Login.js';
import Registry from './pages/Registry.js';

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