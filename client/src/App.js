import './App.css';
import LoadingSpinner from './components/loading/loading';
import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('cookie');
  const [allCookies, setAllCookies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cookies, setCookies] = useState();

  function handleSubmit(e) {
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
  }

 /*  if(!loading){
    console.log(cookies)
    cookies.forEach(cookie => {
      console.log(cookie);
    })
  } */

  return (
    <>
      <h1>Webcrawler</h1>
      <form>
        <label>
          URL:
          <input type="text" name="url" onChange={(e) => setUrl(e.target.value)} />
        </label>
        <label>
          Type:
          <select onChange={(e) => setType(e.target.value)}>
            <option value="cookie">Cookie</option>
            <option value="content">Content</option>
          </select>
        </label>
        <label>
          Accept all cookies:
          <input type="checkbox" name="acceptAll" onChange={(e) => setAllCookies(e.target.checked)} />
        </label>
        <button type="submit" onClick={handleSubmit}>Crawl</button>
      </form>
      {(!loading) ? cookies?.map(cookie => {
          const date = new Date(cookie.expires * 1000);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const expires = `${day}. ${month} ${year}`;
          return <>
            <div>
              <h3>{cookie.name}</h3>
              <p>Value: {cookie.value}</p>
              <p>Domain: {cookie.domain}</p>
              <p>Path: {cookie.path}</p>
              <p>Expires: {expires}</p>
              <p>Size: {cookie.size}</p>
              <p>HttpOnly: {cookie.httpOnly}</p>
              <p>Secure: {cookie.secure}</p>
              <p>Session: {cookie.session}</p>
            </div>
            </>;
        }) : <LoadingSpinner />}
    </>
  );
}

export default App;
