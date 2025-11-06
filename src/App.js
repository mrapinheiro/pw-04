import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Project from './components/Project';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<Project />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
