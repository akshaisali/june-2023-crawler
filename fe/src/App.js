import './App.css';

import { useState, useRef, useEffect } from 'react';

import axios, * as others from 'axios';

function App() {
    const [artists, setArtists] = useState([]);
    const [tracks, setTracks] = useState([])
    const [lyrics, setLyrics] = useState([])
    

    useEffect(() => {
        axios.get("http://127.0.0.01:8000//api/v1/artist")
            .then((resp) => {
                setArtists(resp.data.artists);
                setTracks([])
                setLyrics([])

                
            });
        },[]);
        
        
        function onClickHandlerTracks(e) {
            e.preventDefault();
            const artistId = e.currentTarget.getAttribute('artist_id');
            axios.get(`http://127.0.0.1:8000/api/v1/artist/${artistId}`)
                .then((resp) => {
                    setTracks(resp.data.tracks);
    
                });
        }
  
        function onClickHandlerLyrics(e) {
            e.preventDefault()
            const trackId = e.currentTarget.getAttribute('track_id')
    
            axios.get(`http://127.0.0.1:8000/api/v1/song/${trackId}`)
                .then((resp) => {
                    setLyrics([resp.data])
                    console.log(resp.data)
                })
        }
        
    return (
          <div className="row">
          <div className="col">
            
          <h2> Artists </h2>
          <ul>
                          {artists.map(((artist, idx)=><li key={`artist${artist.id}`}style={{ animationDelay: `${idx * 0.2}s` }} className="artist-item">
                                        <a className='artists'
                                        href={`http://127.0.0.01:8000/api/v1/artist/${artist.id}`}
                                        onClick={onClickHandlerTracks}
                                        artist_id={artist.id}>{artist.name}
                                        </a>
                                        </li>))}
            </ul>
          </div>
          <div className="col">
          <h2> Tracks </h2>
          
          <ul>
                
                    {tracks.map(((track, idx) => <li key={`track${track.id}`} style={{ animationDelay: `${idx * 0.2}s` }} className="track-item">
                        <a className='lyrics'
                            href={`http://127.0.0.1:8000/api/v1/song/${track.id}`}
                            onClick={onClickHandlerLyrics}
                            track_id={track.id}
                        >{track.name}
                        </a>
                    </li>))}
             </ul>
             
          </div>
          <div className="col">
           <h2> Lyrics </h2>
            {lyrics.map(((lyric, idx) => 
                <div key={idx}style={{ animationDelay: `${idx * 0.6}s` }} className="lyrics-item">
                    <div><h2 >{lyric.name}</h2></div>
                    <div class="lyrics">{lyric.lyrics}</div>
                </div>))}
          </div>
          </div>
  );
}

export default App;
