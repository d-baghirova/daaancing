import React from "react";
import './TrackList.css';
//import SearchBar from '../SearchBar/SearchBar';
//import SearchResults from '../SearchResults/SearchResults';
//import Playlist from '../Playlist/Playlist';
//import {TrackList} from '../TrackList/TrackList';
import Track from '../Track/Track';

class TrackList extends React.Component {
    render() {
        return(
            <div className="TrackList">
                { 
                    this.props.tracks.map(track => {
                        return <Track onRemoveSearch={this.props.onRemoveSearch} isRemoval={this.props.isRemoval} onRemove={this.props.onRemove} onAdd={this.props.onAdd} track={track} key={track.id}/>
                    })
                }
            </div>
        )
    }
}

export default TrackList;
