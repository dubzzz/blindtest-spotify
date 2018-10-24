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
    this.state = { songsLoaded: false, currentTrack: null, tracks: null };
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
        const tracks = data.items.map(t => t.track).filter(t => t.preview_url != null);
        this.setState({ tracks, currentTrack: null });
      })
      .then(() => this.selectRandomSong());
  }
  selectRandomSong() {
    if (this.state.timeout) {
      clearInterval(this.state.timeout);
    }
    const tracks = this.state.tracks;
    const otherTracks =
      this.state.currentTrack == null ? tracks : tracks.filter(t => t.id !== this.state.currentTrack.id);
    const currentTrackIndex = (Math.random() * otherTracks.length) | 0;
    const currentTrack = otherTracks[currentTrackIndex];
    const timeout = setTimeout(() => this.selectRandomSong(), 30000);
    this.setState({ tracks, currentTrack, timeout });
  }
  checkAnswer(track) {
    if (track.id === this.state.currentTrack.id) {
      swal('Congrats!', 'Nice ;)', 'success').then(() => {
        this.selectRandomSong();
        this.render();
      });
    } else swal('Try again', 'Please try again...', 'error');
  }
  render() {
    if (this.state.currentTrack == null) {
      return <img src={loading} alt="Loading..." />;
    }
    const currentTrack = this.state.currentTrack;
    const shuffledTracks = shuffleArray(this.state.tracks.filter(t => t.id !== currentTrack.id));
    const availableChoices = [...shuffledTracks.slice(0, 2), currentTrack];
    const buttons = shuffleArray(
      availableChoices.map(t => <Button onClick={() => this.checkAnswer(t)}>{t.name}</Button>)
    );
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
