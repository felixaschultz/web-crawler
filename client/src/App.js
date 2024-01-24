import './App.css';
import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [type, setType] = useState('cookie');
  const [allCookies, setAllCookies] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const website = document.getElementById('website');
    document.getElementById('website').innerHTML = '<h2 style="grid-column: 1/3">Loading...</h2>';
    if(type === 'cookie'){
      fetch(`http://localhost:3003/crawl?url=${url}&acceptAll=${allCookies}`)
      .then(res => res.json())
      .then(data => {
        if(data.message){
          website.innerHTML = `<h2 style="grid-column: 1/3">${data.message}</h2>`;
          return;
        }
        website.innerHTML = `<h2 style="grid-column: 1/2">${url}</h2>`;
        website.innerHTML += `<p style="grid-column: 2/3">Found ${data.length} cookies</p>`;
        data?.forEach(cookie => {
          website.innerHTML += `
            <div>
              <h3>${cookie.name}</h3>
              <p>Value: ${cookie.value}</p>
              <p>Domain: ${cookie.domain}</p>
              <p>Path: ${cookie.path}</p>
              <p>Expires: ${cookie.expires}</p>
              <p>Size: ${cookie.size}</p>
              <p>HttpOnly: ${cookie.httpOnly}</p>
              <p>Secure: ${cookie.secure}</p>
              <p>Session: ${cookie.session}</p>
            </div>`;
        });
      });
    }else if(type === 'content'){
      fetch(`http://localhost:3003/crawl/site?url=${url}`)
      .then(res => res.text())
      .then(data => {
        const website = document.getElementById('website');
        website.innerHTML = data;
      });
    }
  }

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
          Accept All:
          <input type="checkbox" name="acceptAll" onChange={(e) => setAllCookies(e.target.checked)} />
        </label>
        <button type="submit" onClick={handleSubmit}>Crawl</button>
      </form>
      <div id="website"></div>
    </>
  );
}

export default App;
