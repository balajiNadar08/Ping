import { useState, useEffect } from 'react';
import './App.css';
import Preloader from './components/Preloader.jsx';
import Bandwidth from './components/Bandwidth.jsx';

function App() {

  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    setPageLoading(true);

    setTimeout(() => {
      setPageLoading(false);
    }, 2000);
  }, []);

  
  return (
    <div className="animated-gradient-bg">
      { pageLoading ? <Preloader /> : <Bandwidth /> }
    </div>
  );
}

export default App;