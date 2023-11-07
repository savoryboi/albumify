import { useState } from "react";
import AlbumTracks from "./AlbumTracks";

function Album({ album, allTopTracks }) {
    const [expanded, setExpanded] = useState(false);

    const handleAlbumClick = () => { !expanded ? setExpanded(true) : setExpanded(false) };

    return <div className='album_container' key={album.id} onClick={handleAlbumClick}>
        <div className='album_wrapper'>
            <div className='album_info' key={album.id}>
                <h2 className='album_name'>{album.name}</h2>
                {album.artists ? <p className='album_artist'>{album.artists[0].name}</p> : <span className="loading"></span>}
            </div>
            {album.images ?
                <img className='album_cover' src={album.images[0].url} height={'120px'} width={'120px'} alt={album.name} />

                : <div></div> // placeholder
            }
        </div>
            {expanded ? <AlbumTracks album={album} allTopTracks={allTopTracks} /> : <div></div>}
    </div>
}

export default Album;