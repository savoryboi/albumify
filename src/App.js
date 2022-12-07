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
  const [topTracks, setTopTracks] = useState([{}]);
  const [displayTracks, setDisplayTracks] = useState(false);
  const [topAlbums, setTopAlbums] = useState([{}]);
  const [timeFrame, setTimeFrame] = useState('medium_term');

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1]
      console.log(token)

      window.location.hash = "";
      window.localStorage.setItem("token", token)
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

  const getTopTracks = async (time_input) => {
    setDisplayTracks(true)
    setTimeFrame(time_input);


    const { data } = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      params: {
        limit: 50,
        time_range: `${time_input}` || 'medium_term'
      },
      headers: {
        'Accept': "application/json",
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    const albumData = data.items.map(track => {
      return track.album
    });

    // remove all album objects that only occur once 
    function removeUnique(arr) {
      var newArr = [];
      for (var i = 0; i < arr.length; i++) {
        var count = 0;
        // 2nd for-loop to compare 
        for (var j = 0; j < arr.length; j++) {
          if (arr[j].name == arr[i].name) {
            count++;
          }
        }
        if (count >= 2) {
          newArr.push(arr[i]);
        }
      }
      console.log(newArr)
      return newArr;
    }

    const repeatAlbums = removeUnique(albumData);

    // isolate album names to more easily count frequency and sort into descending order
    const repeatAlbumNames = repeatAlbums.map(album => album.name)
    // console.log(repeatAlbumNames)

    // sorting array by frequency
    
    const sortByFrequency = (array) => {
      var frequency = {};
      
      array.forEach(function (value) { frequency[value] = 0; });
      
      var uniques = array.filter(function (value) {
        return ++frequency[value] == 1;
      });
      
      return uniques.sort(function (a, b) {
        return frequency[b] - frequency[a];
      });
    }
    const albumsByFreq = sortByFrequency(repeatAlbumNames);
    
    const topAlbumData = albumsByFreq.map(title => {
      for(let i = 0; i < repeatAlbums.length; i++) {
        if(title === repeatAlbums[i].name){
          return repeatAlbums[i];
        }
      }
    })
console.log(topAlbumData)

    setTopAlbums(topAlbumData);
  }

  const renderTracks = () => {
    if (token && displayTracks) {
      return <div id='top-track-display'>
        <h1 id='album_list_header'>my top albums</h1>
        {topAlbums.map(album => {
          return <div className='album_wrapper' key={album.id}>
            <div className='album_info'>
            <h2 className='album_name'>{album.name}</h2>
            {album.artists ? <p className='album_artist'>{album.artists[0].name}</p> : <p>no artist listed</p>}
            </div>
            {album.images ?
              <img className='album_cover' src={album.images[0].url} height={'120px'} width={'120px'} />

              : <p>no image to display</p>
            }

          </div>


        })
        }
      </div>
    }
  }

  return (
    <div className="App">
      <div className='auth_stuff'>
        <h1>ALBUMS: WRAPPED</h1>
        {!token ?
          <a id='loginLink' href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}&show_dialogue=true`}>login to spotify</a>

          : <button id='logoutBtn' onClick={logout}>logout</button>
        }
        {
          token ?
          <div>
          <h3>select one of the following time frames:</h3>
            <form id='user_selection'>
              <input id={'short_term'} name={'time_frame'} value={'short_term'} type={'radio'} />
              <label htmlFor={'short_term'}>very recently</label><br/>
              <input id={'medium_term'} name={'time_frame'} value={'medium_term'} type={'radio'} />
              <label htmlFor={'medium_term'}>last chunk of my life</label><br/>
              <input id={'long_term'} name={'time_frame'} value={'long_term'} type={'radio'} />
              <label htmlFor={'long_term'}>basically all-time</label><br/>
              <button onClick={(e) => {
                e.preventDefault()
                const formAnswer = document.querySelector('input[name=time_frame]:checked').value;

                console.log(formAnswer)

                getTopTracks(formAnswer)
                }}>
                
                get my top albums
                </button>
            </form>
            </div>

            : <div> <h3>pls login</h3> </div>
        }
        <div className='divider'></div>
      </div>
      {renderTracks()}
    </div>

  );
}

export default App;
