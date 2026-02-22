import axios from "axios";
let spotifyToken = null;
let tokenExpiry = null;

export const getSpotifyToken = async () => {
  if (spotifyToken && tokenExpiry > Date.now()) {
    return spotifyToken;
  }

  const authString = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  spotifyToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;

  return spotifyToken;
};

