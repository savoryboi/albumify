import { useState } from "react";

function AlbumTracks({ album, allTopTracks }) {
    let topAlbumTracks = [];

    allTopTracks.forEach(t => {
        if(t.album.name === album.name){
            topAlbumTracks.push(t)
        }
    })


    return (<div className="album_tracks">
        <h2>most played:</h2>
        {topAlbumTracks.map(track => {
            return <h3 key={track.id}>{track.name}</h3>
        })}
    </div>)
}

export default AlbumTracks;