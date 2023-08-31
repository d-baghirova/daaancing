import React from "react";
import './Track.css';
import ReactAudioPlayer from 'react-audio-player'
//import SearchBar from '../SearchBar/SearchBar';
//import SearchResults from '../SearchResults/SearchResults';
//import Playlist from '../Playlist/Playlist';
//import {TrackList} from '../TrackList/TrackList';
//import {Track} from '../Track/Track';

class Track extends React.Component {
 
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    renderAction() {
        if (this.props.isRemoval){
            return <button className="Track-action" onClick={this.removeTrack}>-</button>
        } else {
            return <button className="Track-action" onClick={this.addTrack}>+</button>
        }
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    addTrack() {
        this.props.onAdd(this.props.track); 
    }

    render() {
        return(
            <div className="Track">
              <div className="Track-information">
                <h3>{this.props.track.name}</h3>
                  <p>{this.props.track.artist} | {this.props.track.album} | Preview (30seconds of the track)</p>
                  <ReactAudioPlayer
                      className="player"
                      controlsList="nodownload"
                      src={this.props.track.preview_url}
                      controls
                  />
              </div> 
              {this.renderAction()}
            </div>
        )
    }
}

export default Track;
