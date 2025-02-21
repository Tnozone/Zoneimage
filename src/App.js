
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.js';
import Home from './pages/Home.js';
import Editor from './pages/Editor.js';
import Login from './pages/Login.js';
import Registry from './pages/Registry.js';
import Gallery from './pages/Gallery.js'
import DeleteAccount from './pages/DeleteAccount.js';

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Editor" element={<Editor />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registry" element={<Registry />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/DeleteAccount" element={<DeleteAccount />} />
      </Routes>
    </Router>
  );
}

export default App;