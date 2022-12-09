import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

// import TopTracks from './components/TopTracks';

function App() {
  const CLIENT_ID = '6511dcedebcb42eeb0e01b7057db1b12';
  const REDIRECT_URI = 'https://imaginative-axolotl-a18101.netlify.app';
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
      for (let i = 0; i < repeatAlbums.length; i++) {
        if (title === repeatAlbums[i].name) {
          return repeatAlbums[i];
        }
      }
    })
    console.log(topAlbumData)

    setTopAlbums(topAlbumData);
  }

  const renderTracks = () => {
    if (token && displayTracks) {
      return <div id='top-album-display'>
        <div className='track_header'>
          <h1 id='album_list_header'>my top albums</h1>
          <h2 id='time_display'>{timeFrame === 'short_term' ? 'this month' : timeFrame === 'medium_term' ? 'last 6 months' : 'of all time'}</h2>
        </div>
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

  // const downloadImage = async () => {
  //   var node = document.getElementById('top-album-display');

  //   html2canvas(node, {
  //     useCORS: true, 
  //     allowTaint: true, 
  //     backgroundColor: '#BB2649', 
  //   })
  //     .then(function (canvas) {
  //       document.body.appendChild(canvas)
  //     })
  // }

  return (
    <div className="App">
      <div className='auth_stuff'>
        <h1>ALBUMIFY</h1>
        {!token ?
          <div className='login_wrapper'>
            <a id='loginLink' href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}&show_dialogue=true`}>login to spotify</a>
          </div>
          : <button id='logoutBtn' onClick={logout}>LOGOUT</button>
        }
        {
          token ?
            <div>
              <h3>choose a time frame</h3>
              <form id='user_selection'>
                <input id={'short_term'} name={'time_frame'} value={'short_term'} type={'radio'} />
                <label htmlFor={'short_term'}>4 weeks</label>
                <input id={'medium_term'} name={'time_frame'} value={'medium_term'} type={'radio'} />
                <label htmlFor={'medium_term'}>6 months</label>
                <input id={'long_term'} name={'time_frame'} value={'long_term'} type={'radio'} />
                <label htmlFor={'long_term'}>all-time</label>
                <button id='submitBtn' onClick={(e) => {
                  e.preventDefault()
                  const formAnswer = document.querySelector('input[name=time_frame]:checked').value;

                  console.log(formAnswer)

                  getTopTracks(formAnswer)
                }}>

                  SUBMIT
                </button>
              </form>
            </div>

            : <div></div>
        }
        <div className='divider'></div>
      </div>
      {renderTracks()}
      {/* <button onClick={() => downloadImage()}>download image</button> */}
    </div>

  );
}

export default App;
