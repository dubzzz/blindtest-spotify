/*global swal*/
// @ts-check

import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import { AlbumCover } from './AlbumCover';
import Button from './Button';
import { apiToken } from './tokens';

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

class App extends Component {
  constructor() {
    super();
    this.state = { songsLoaded: false, tracks: null };
  }
  componentDidMount() {
    fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ songsLoaded: true, tracks: data.items.filter(t => t.track.preview_url != null) });
      });
  }
  render() {
    if (!this.state.songsLoaded) {
      return <img src={loading} alt="Loading..." />;
    }
    const currentTrack = this.state.tracks[0].track;
    const buttons = shuffleArray(this.state.tracks.slice(0, 3).map(t => <Button>{t.track.name}</Button>));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome</h1>
        </header>
        <div className="App-images">
          <Sound url={currentTrack.preview_url} playStatus={Sound.status.PLAYING} />
          <AlbumCover track={currentTrack} />
        </div>
        <div className="App-buttons">{buttons}</div>
      </div>
    );
  }
}

export default App;
