import React from "react";
import { Bars } from "react-loader-spinner";
import './App.css';
import logo from './snoopdog.gif';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from "../../util/Spotify";

//import { setSelectionRange } from "@testing-library/user-event/dist/utils";
////import {TrackList} from '../TrackList/TrackList';
//import {Track} from '../Track/Track';

class App extends React.Component { 

    constructor(props) {
      super(props);
      this.state = {
        searchResults: [], 
        playlistName: 'New Playlist',
        playlistTracks: [],
        searching: false,
        saving: false,
        loggedIn: sessionStorage.getItem("loggedIn") || false
        } 

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search= this.search.bind(this);
        this.auth = this.auth.bind(this);
    }

    login = () => {
      Spotify.getAccessToken();
      Spotify.getUserPlaylists().then((res) => {
        this.setState((st) => ({
          ...st,
          getUserPlaylists: res,
        }));
      });
      sessionStorage.setItem("loggedIn", "true");
    }

    updatePlaylistName(name) {
      this.setState({playlistName: name});
    }

    removeSearch(track) {
      if(this.state.playlistTracks.includes(track)){
          console.log('remove the track!')
      }
    }

    removeTrack(track) {
      let tracks = this.state.playlistTracks;
      let stracks = this.state.searchResults;
      if (stracks.find(savedTrack => savedTrack.id === track.id)){
        return;
      }
      stracks.unshift(track);
      tracks = tracks.filter(removedTrack => removedTrack.id !== track.id)
      this.setState({playlistTracks: tracks});
      this.setState({searchResults: stracks});
    }

    addTrack(track) {
      let tracks = this.state.playlistTracks;
      let stracks = this.state.searchResults;
      if (tracks.find(savedTrack => savedTrack.id === track.id)){
        return;
      }
      tracks.push(track);
      stracks = stracks.filter(removedTrack => removedTrack.id !== track.id)
      this.setState({playlistTracks: tracks});
      this.setState({searchResults: stracks});
    }

    savePlaylist() {
      const trackUris = this.state.playlistTracks.map(track => track.uri); 
      Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
        this.setState({
          playlistName: 'New Playlist',
          playlistTracks: []
        })
      });
      this.handleSaveClick();
    }

    auth() {
      Spotify.getAccessToken();
    }

    search(term) {
      
      Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
      })
    }

    handleSaveClick = () => {
      this.setState({saving: true});
      setTimeout(() => {
        this.setState({          
          saving: false,
        })
      }, 2000)
    }

    handleSearchClick = () => {
      this.setState({searching: true});
      setTimeout(() => {
        this.setState({
          searching: false,
        })
      }, 2000)
    };

    render() {
        return(
            <div>
              <h1>D<span className="highlight">AAA</span>NCING</h1>
              <div className="App">     
                <p><br /></p>
                <p className="tutorial">Search a song that you like and it will appear in 'Result' section, click the + buttons to add the song to your playlist which is at the bottom of the page.</p>
                <SearchBar click={this.handleSearchClick} sclick={this.handleSaveClick} onSearch={this.search} onAuth={this.auth} />
                <div className="App-playlist">
                  <div className="Searching">
                    {
                      !this.state.searching ? (
                        <SearchResults onRemoveSearch={this.removeSearch} onAdd={this.addTrack} searchResults={this.state.searchResults} />) : (
                          <div className="loader">
                            <img src={logo} alt="loading..."  />
                        </div>
                      )
                    }
                  </div>
                  <div className="Searching">
                    {
                      !this.state.saving ? (
                        <Playlist login={this.login} onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} />) : (
                          <div className="loader">
                            <img src={logo} alt="loading..."  />
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
        )
      }
    }

export default App;
