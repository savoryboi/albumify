import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import EmailButton from './components/EmailButton';
import Album from './components/Album';

function App() {

  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';
  const SCOPE = 'user-top-read';
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

  // easy access to dev redirect uri
  const REDIRECT_URI = 'http://localhost:3000';

  // producion redirec uri
  // const REDIRECT_URI = 'https://albumify.netlify.app';

  const [token, setToken] = useState("");
  const [displayTracks, setDisplayTracks] = useState(false);
  const [topAlbums, setTopAlbums] = useState([{}]);
  const [timeFrame, setTimeFrame] = useState('');
  const [topTracks, setTopTracks] = useState([]);




  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token)
    }

    setToken(token)
  }, [])

  const logout = () => {
    setToken("");
    window.localStorage.removeItem('token');

  }

  const getTopTracks = async (time_input) => {
    console.log(`Fetching top tracks for time frame: ${time_input}`);
    setDisplayTracks(true)
    setTimeFrame(time_input);


    const { data } = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      params: {
        time_range: `${time_input}` || 'medium_term',
        limit: 50
      },
      headers: {
        'Accept': "application/json",
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    // second api request to pull next set of user top tracks. making total 100 tracks to analyze and find common album tracks
    const data2 = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      params: {
        offset: 49,
        limit: 50,
        time_range: `${time_input}` || 'medium_term'
      },
      headers: {
        'Accept': "application/json",
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    // get top tracks 
    const trackData = data.items;
    const trackData2 = data2.data.items;
    const allTopTracks = trackData.concat(trackData2);



    // extract album data from each song 
    const albumData = data.items.map(track => {
      return track.album;
    });
    // repeating above step to gather larger dataset
    const albumData2 = data2.data.items.map(track => {
      return track.album;
    });

    // concatinate the two arrays of album data from separate api reqs
    const allUnfilteredAlbumData = albumData.concat(albumData2);

    // filter array of 100 tracks so only those that are ALBUMS (not singles or EPs) remain 
    const allAlbumData = allUnfilteredAlbumData.filter(obj => { return obj.album_type === "ALBUM" });

    // remove all album objects that only occur once ... AKA remove all albums that clearly only have one good song lmao
    function removeUnique(arr) {
      var newArr = [];
      for (var i = 0; i < arr.length; i++) {
        var count = 0;
        // 2nd for-loop to compare 
        for (var j = 0; j < arr.length; j++) {
          if (arr[j].name === arr[i].name) {
            count++;
          }
        }
        if (count >= 3) {
          newArr.push(arr[i]);
        }
      }
      // console.log(newArr)
      return newArr;
    }



    const repeatAlbums = removeUnique(allAlbumData);

    // isolate album names to more easily count frequency and sort into descending order
    const repeatAlbumNames = repeatAlbums.map(album => album.name)

    // sorting array of album names by frequency
    const sortByFrequency = (array) => {
      var frequency = {};

      array.forEach(function (value) { frequency[value] = 0; });

      var uniques = array.filter(function (value) {
        return ++frequency[value] === 1;
      });

      return uniques.sort(function (a, b) {
        return frequency[b] - frequency[a];
      });
    }
    const albumsByFreq = sortByFrequency(repeatAlbumNames);

    // using sorted array of album names to get array of album data objects in that order
    const topAlbumData = albumsByFreq.map((title) => {
      for (let i = 0; i < repeatAlbums.length; i++) {
        if (title === repeatAlbums[i].name) {
          return repeatAlbums[i];
        }
      }
    })

    setTopAlbums(topAlbumData);
    setTopTracks(allTopTracks);
  }

  const handleRadioChange = (e) => {
    setTimeFrame(e.target.value);
    console.log('changed')
    handleSubmit(e.target.value)
  }

  const handleSubmit = (timeFrame) => {

    getTopTracks(timeFrame)
  }



  const renderTracks = () => {

    if (token && displayTracks) {
      return <div id='top-album-display'>
        <div className='track_header'>
          <h1 id='album_list_header'>my top albums</h1>
          <h2 id='time_display'>{timeFrame === 'short_term' ? 'this month' : timeFrame === 'medium_term' ? 'last 6 months' : 'of all time'}</h2>
        </div>

        {topAlbums.map(album => {
          return <Album album={album} allTopTracks={topTracks} key={album.id} />

        })
        }
      </div>
    }
  }

  return (
    <div className="App">
      <div className='auth_stuff'>
        <h1>ALBUMIFY</h1>
        {!token ?
          <div className='login_wrapper'>
            <a id='loginLink' href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}&show_dialogue=true`}>login to spotify</a>
            <div id='warning_wrapper'>
              <h3 id='login_warning'>due to API restrictions, this application is only available to those given permission manually by the developer.</h3>
              <EmailButton></EmailButton>
            </div>
          </div>
          : <button id='logoutBtn' onClick={logout}>LOGOUT</button>
        }
        {
          token ?
            <div>
              <h3>choose a time frame, click to see most played tracks</h3>
              <form id='user_selection' onSubmit={handleSubmit}>
                <input
                  id={'short_term'}
                  name={'time_frame'}
                  value={'short_term'}
                  type={'radio'}
                  onClick={handleRadioChange}
                />
                <label htmlFor={'short_term'}>4 weeks</label>
                <input
                  id={'medium_term'}
                  name={'time_frame'}
                  value={'medium_term'}
                  type={'radio'}
                  onClick={handleRadioChange}
                />
                <label htmlFor={'medium_term'}>6 months</label>
                <input
                  id={'long_term'}
                  name={'time_frame'}
                  value={'long_term'}
                  type={'radio'}
                  onClick={handleRadioChange}
                />
                <label htmlFor={'long_term'}>all-time</label>
              </form>
            </div>

            : <div></div>
        }
        <div className='divider'></div>
      </div>
      {renderTracks()}
    </div>

  );
}

export default App;
