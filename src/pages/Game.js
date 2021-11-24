import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import getGravatar from '../services/gravatar';

class Game extends Component {
  render() {
    const { name, email } = this.props;
    return (
      <header data-testid="header-profile-picture">
        <img
          src={ getGravatar(email) }
          data-testid="header-profile-picture"
          alt="avatar"
        />
        <h3 data-testid="header-player-name">{ name }</h3>
        <h4 data-testid="header-score">0</h4>
      </header>
    );
  }
}

Game.propTypes = {
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  name: state.loginReducer.playerName,
  email: state.loginReducer.playerEmail,
});

export default connect(mapStateToProps, null)(Game);
