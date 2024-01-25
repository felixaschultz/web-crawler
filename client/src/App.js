import './App.css';
import LoadingSpinner from './components/loading/loading';
import { useState } from 'react';
import Crawler from './components/crawler';

function App() {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('cookie');
  const [allCookies, setAllCookies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cookies, setCookies] = useState();

  /* function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if(type === 'cookie'){
      fetch(`http://localhost:3003/crawl?url=${url}&acceptAll=${allCookies}`)
      .then(res => res.json())
      .then(data => {
        setCookies(data);
      }).finally(() => {
        setLoading(false);
      });
    }else if(type === 'content'){
      fetch(`http://localhost:3003/crawl/site?url=${url}`)
      .then(res => res.text())
      .then(data => {
        
      });
    }
  } */

 /*  if(!loading){
    console.log(cookies)
    cookies.forEach(cookie => {
      console.log(cookie);
    })
  } */

  return (
    <>
      <Crawler />
    </>
  );
}

export default App;
