import React, { Component } from 'react';
import logo from '../trivia.png';
// import { connect } from 'react-redux';

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
    // this.handleSubmit = this.handleSubmit.bind(this);
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

  // handleSubmit() {
  //   e.preventDefault();
  //   const { history, getName } = this.props;
  //   const { email } = this.state;
  //   getEmail(email);
  //   history.push('/game');
  // }

  render() {
    const { playerName, playerEmail, disable } = this.state;
    return (
      // <form onSubmit={ this.handleSubmit }>
      <form>
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

// const mapDispatchToProps = (dispatch) => ({
//   getName: (state) => dispatch(state),
// });

// export default connect(null, mapDispatchToProps)(Login);

export default Login;
