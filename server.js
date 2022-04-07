// define app constants
const express = require('express');
const app = express();
const axios = require('axios');

// define spotify api uri's and auth info
// enter spotify api auth credentials in the corresponding constants
const GET_CURRENTLY_PLAYING_TRACK_URI='https://api.spotify.com/v1/me/player/currently-playing';
const SPOTIFY_TOKEN_URI = "https://accounts.spotify.com/api/token";
const SPOTIFY_REFRESH_TOKEN = "";
const CLIENT_ID = "";
const CLIENT_SECRET = "";

// server port
const port = 11448;

// returns spotify access token from permanent refresh token
function get_access_token(refresh_token) {
    return axios({
        method: 'post',
        url: SPOTIFY_TOKEN_URI,
        params: {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET
        },
        header: {
            "Content-Type": "x-www-form-urlencoded"
        }
    }).then(res => res.data.access_token).catch(err => {
        console.log(err)
    })
}

// returns current track data from spotify api
function get_current_track(access_token) {
    return axios({
        method: 'GET',
        url: GET_CURRENTLY_PLAYING_TRACK_URI,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
    }).then(res => res.data).catch(err => {
        console.log(err)
    })
}

// api endpoint
app.get('/', (req,res) => {
    get_access_token(SPOTIFY_REFRESH_TOKEN).then(token => {
        get_current_track(token).then(track => {
            res.json({
                "track": track.item.name,
                "album": track.item.album.name,
                "artists": track.item.artists,
                "art": track.item.album.images,
                "spotifyopen_url": track.item.external_urls.spotify,
                "preview_url": track.item.preview_url
            })
        }).catch(err => {
            res.json({})
        })
    })
    console.log(`REQUEST SENT TO: ${req.ip}`)
})

// start api
app.listen(port, () => console.log(`Running server on port ${port}`));
