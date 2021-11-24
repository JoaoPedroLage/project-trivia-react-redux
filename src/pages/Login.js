import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUser, getToken } from '../redux/actions/loginAction';
import logo from '../trivia.png';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: '',
      playerEmail: '',
      disable: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value },
      () => this.enableButton());
  }

  enableButton() {
    const { playerEmail, playerName } = this.state;
    if (playerEmail.length > 0 && playerName.length > 0) {
      this.setState({ disable: false });
    } else this.setState({ disable: true });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { history, dispatchGetToken, getName } = this.props;
    const { email, name } = this.state;
    getName(name, email);
    dispatchGetToken();
    history.push('/game');
  }

  render() {
    const { playerName, playerEmail, disable } = this.state;
    return (
      <form onSubmit={ this.handleSubmit }>
        <img src={ logo } className="App-logo" alt="logo" />
        <label
          htmlFor="input-player-name"
        >
          {' '}
          Nome:
          <input
            data-testid="input-player-name"
            id="player-name"
            name="playerName"
            value={ playerName }
            onChange={ this.handleChange }
          />
        </label>
        <label
          htmlFor="gravatar-email"
        >
          {' '}
          Email:
          <input
            data-testid="input-gravatar-email"
            id="gravatar-email"
            name="playerEmail"
            value={ playerEmail }
            onChange={ this.handleChange }
          />
        </label>
        <button
          type="submit"
          data-testid="btn-play"
          disabled={ disable }
        >
          Jogar
        </button>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getName: (name, email) => dispatch(setUser(name, email)),
  dispatchGetToken: () => dispatch(getToken()),
});

Login.propTypes = {
  dispatchGetToken: PropTypes.func.isRequired,
  getName: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
