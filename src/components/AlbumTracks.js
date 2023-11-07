import { useState } from "react";

function AlbumTracks({ album, allTopTracks }) {
    let topAlbumTracks = [];

    allTopTracks.forEach(t => {
        if(t.album.id === album.id && !topAlbumTracks.some(track => track.id === t.id)){
            topAlbumTracks.push(t)
        }
    })

    const trackArr = [... new Set(topAlbumTracks)];
    console.log(trackArr);

    return (<div className="album_tracks">
        <h2>most played:</h2>
        {trackArr.map(track => {
            console.log(track)
            return <h3 key={track.id}>{track.name}</h3>
        })}
    </div>)
}

export default AlbumTracks;