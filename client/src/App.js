import './App.css';
import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`http://localhost:3003/crawl?url=${url}`)
      .then(res => res.json())
      .then(data => {
        const website = document.getElementById('website');
        website.innerHTML = `<h2>${url}</h2>`;
        data.forEach(cookie => {
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
  }

  return (
    <>
      <h1>Webcrawler</h1>
      <form>
        <label>
          URL:
          <input type="text" name="url" onChange={(e) => setUrl(e.target.value)} />
        </label>
        <button type="submit" onClick={handleSubmit}>Crawl</button>
      </form>
      <div id="website"></div>
    </>
  );
}

export default App;
