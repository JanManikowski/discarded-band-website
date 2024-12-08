import axios from 'axios';

const CLIENT_ID = '31be45b92da64fbb85790766ba34262f';
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

export const getAccessToken = () => {
    const hash = window.location.hash;
    let token = sessionStorage.getItem('spotify_token');

    if (!token && hash) {
        const tokenMatch = hash.match(/access_token=([^&]*)/);
        if (tokenMatch) {
            token = tokenMatch[1];
            sessionStorage.setItem('spotify_token', token);
        }
        window.location.hash = '';
    }

    return token;
};

export const authorizeSpotify = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
};

export const fetchSpotifyData = async (url, token) => {
    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
