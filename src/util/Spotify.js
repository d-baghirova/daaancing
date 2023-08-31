import axios from "axios";


const clientId = 'aff29c5a39c3485392813a97afa720a7';
const redirectUri = 'http://localhost:3000/';
// const redirectUri = 'https://playlists-creator.surge.sh/';

let accessToken;
let user_id = "";

let Spotify = {

  getAccessToken(){
    if(accessToken){ 
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
  //  
    if ( accessTokenMatch && expiresInMatch ){
        accessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
    } 
    else {
        const accessUrl= `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = accessUrl;
    }
  },

  async getCurrentUserId() {
    this.getAccessToken();
    if (user_id) {
      return user_id;
    }

    user_id = await axios
     .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }) 
      .then((res) => res.data.id)
      .catch((e) => console.log("User id fetch error!", e));

    return user_id;
  },

  async getUserPlaylists() {
    user_id = user_id
      ? user_id
      : await this.getCurrentUserId().then((res) => res);
    accessToken = accessToken ? accessToken : this.getAccessToken();
    let playlists = await axios
      .get(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data.items)
      .catch((e) => console.log("error retrieving playlists!"));
    return playlists;
  },

  search(term){
    const accessToken = Spotify.getAccessToken();

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { headers: { Authorization: `Bearer ${accessToken}`}
      }).then((response)=>{
          return response.json();
      }).then((jsonResponse)=>{
          console.log(jsonResponse);
          if (!jsonResponse.tracks){
              return [];
          }
          return jsonResponse.tracks.items.map(track => (
            {
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                preview_url: track.preview_url,
                image: track.album.images[2]
            }));
        });
  },

  savePlaylist(name, trackUris){
    if( !name || !trackUris.length ){
        return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}`};
    let userId;
  
    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response=> response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
        {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        });
      })
    })
  }
};





export default Spotify;