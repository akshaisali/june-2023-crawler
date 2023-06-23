import './App.css';

import { useState, useRef, useEffect } from 'react';

import axios, * as others from 'axios';

function App() {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.01:8000//api/v1/artist")
            .then((resp) => {
                setArtists(resp.data.artists);
            });
        },[]);
    
  return (
          <div className="row">
          <div className="col">
          <h2> Artists </h2>
          <ol>
                          {artists.map(((artist, idx)=><li key={`artist${artist.id}`}>
                                        <a 
                                        href={`http://127.0.0.01:8000/api/v1/artist/${artist.id}`}

                                        >{artist.name}
                                        </a>
                                        </li>))}
          </ol>
          </div>
          <div className="col">
          <h2> Tracks </h2>
          </div>
          <div className="col">
          <h2> Lyrics </h2>
          </div>
          </div>
  );
}

export default App;
