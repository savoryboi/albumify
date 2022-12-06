import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
// import TopTracks from './components/TopTracks';

function App() {
  const CLIENT_ID = '6511dcedebcb42eeb0e01b7057db1b12';
  const REDIRECT_URI = 'http://localhost:3000';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';
  const SCOPE = 'user-top-read';

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([{}]);
  const [displayTracks, setDisplayTracks] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1]
      console.log(token)

      window.location.hash = "";
      window.localStorage.setItem("token", token)
      // setDisplayTracks(false)
    }

    setToken(token)
  }, [])

  const logout = () => {
    setToken("");
    window.localStorage.removeItem('token');

  }

  // const searchArtists = async (e) => {
  //   e.preventDefault()
  //   const { data } = await axios.get("https://api.spotify.com/v1/search", {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     },
  //     params: {
  //       q: searchKey,
  //       type: "artist", 
  //       limit: 5
  //     }
  //   })

  //   setArtists(data.artists.items)
  // }

  // const renderArtists = () => {
  //   console.log(artists)
  //   return artists.map(artist => {

  //     return <div key={artist.id}>
  //       {artist.images.length ? <img src={artist.images[0].url} alt={artist.name + " profile image"} /> : <h1>No img</h1>}
  //     </div>
  //   })
  // }

  const getTopTracks = async () => {
    setDisplayTracks(true)
    const { data } = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      params: {
        limit: 5,
        time_range: 'short_term'

      },
      headers: {
        'Accept': "application/json",
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    setTopTracks(data.items)
    // console.log(topTracks)
  }

  const renderTracks = () => {
    console.log(topTracks);
    if (token && displayTracks) {
      return <div id='top-track-display'>
        <h1 id='top5_title'>ur top five</h1>
        {topTracks.map(track => {
          return <div className='track_wrapper' key={track.id}>
 
            <h2 className='track_name'>{track.name}</h2>
            {track.artists ? <p className='track_artist'>{track.artists[0].name}</p> : <p>no artist listed</p>}
            { track.album ? 
            <img src={track.album.images[0].url} height={'150px'} width={'150px'}/> 
              
            : <p>no image to display</p>
          }

          </div>

        
        })
      }
      </div>
    }
  }

  // getTopTracks()

  return (
    <div className="App">
      <div className='auth_stuff'>
      <h1>Welcome</h1>
      {!token ?
        <a id='loginLink' href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}&show_dialogue=true`}>Login To Spotify</a>

        : <button id='logoutBtn' onClick={logout}>Logout</button>
      }
      {
        token ?
        <div>
            <button onClick={() => getTopTracks()}>get my top tracks</button>
          </div>
          : <div>
            <h3>pls login</h3>
          </div>
      }
      </div>
      {renderTracks()}
    </div>

  );
}

export default App;
