import React, { Component } from 'react';
import './AlbumCover.css';

export class AlbumCover extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <p>
        <img src={this.props.track.album.images[0].url} alt="Cover" />
      </p>
    );
  }
}
