import './App.css';
import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`http://localhost:3003/crawl?url=${url}`)
      .then(res => res.text())
      .then(data => {
        document.getElementById('website').innerHTML = data;
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
