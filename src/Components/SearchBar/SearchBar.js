import React from "react";
import './SearchBar.css';
//import {SearchBar} from '../SearchBar/SearchBar';
//import {SearchResults} from '../SearchResults/SearchResults';
//import {Playlist} from '../Playlist/Playlist';
//import {TrackList} from '../TrackList/TrackList';
//import {Track} from '../Track/Track';

class SearchBar extends React.Component {
 
    constructor(props) {
        super(props);
        localStorage.setItem("term", '')
        this.state = {
            term: localStorage.getItem('term')
    };
        this.search = this.search.bind(this);
        this.auth = this.auth.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        //this.enable = this.enable.bind(this)
    }

    //enable() {
    //    this.setState({disabledButton: false});
    //  }

    search() {
        this.props.onSearch(this.state.term);
        this.props.click();
    }

    auth() {

        const prom = new Promise((resolve, reject) => {
            setTimeout(this.props.onAuth(), 1000)
        })

        prom.then((res) => {
            setTimeout(() => res.localStorage.setItem("enableBtn", 'false'),
            this.setState({btn: localStorage.getItem('enableBtn')}),
             3000)
        })


        //this.props.onAuth();
        //localStorage.setItem("enableBtn", 'false')
        //this.setState({btn: localStorage.getItem('enableBtn')});
    }

    handleTermChange(event) {
        window.localStorage.setItem('term', event.target.value);
        this.setState({term: window.localStorage.getItem('term')});
    }

    render() {
        return(
            <div className="SearchBar">
              <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
              <div className="btns">
                <button onClick={this.search} className="SearchButton">SEARCH</button>
                <button onClick={this.auth} className="AuthButton">LOG IN</button>
              </div>
            </div>
        )
    }
}

export default SearchBar;