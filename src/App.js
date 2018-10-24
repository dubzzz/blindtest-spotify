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
        this.setState({ songsLoaded: true, tracks: data.items });
      });
  }
  render() {
    let content = this.state.songsLoaded ? (
      <p>
        Received {this.state.tracks.length} songs
        <br />
        First song is {this.state.tracks[0].track.name}
      </p>
    ) : (
      <p>
        <img src={loading} alt="Loading..." />
      </p>
    );
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome</h1>
        </header>
        <div className="App-images">
          {content}
          <AlbumCover />
        </div>
        <div className="App-buttons" />
      </div>
    );
  }
}

export default App;
