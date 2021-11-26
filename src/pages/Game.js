import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getQuestions } from '../redux/actions/gameAction';
import getGravatar from '../services/gravatar';

class Game extends Component {
  constructor() {
    super();
    this.renderQuestions = this.renderQuestions.bind(this);
    this.renderAnswer = this.renderAnswer.bind(this);
    // this.handleChange = this.handleChange.bind(this);
  }

  // handleChange({ target }) {
  //   const { value } = target;
  //   this.setState({ answer: value });
  // }

  componentDidMount() {
    const { dispatchGetQuestions, token } = this.props;
    dispatchGetQuestions(token);
  }

  renderQuestions() {
    const { questions } = this.props;
    console.log(questions);
    return (
      questions.length > 0
      && questions.map((element, index) => (
        <div key={ index }>
          <h4 data-testid="question-category">
            { element.category }
          </h4>
          <h5 data-testid="question-text">
            { element.question }
          </h5>
          <section>
            { this.renderAnswer(element) }
          </section>
        </div>
      ))
    );
  }

  renderAnswer(element) {
    // randomificando as respostas
    const answers = [element.correct_answer, ...element.incorrect_answers];
    const magicNumber = 0.5;
    // referencia: https://flaviocopes.com/how-to-shuffle-array-javascript/
    const randomAnswers = answers.sort(() => Math.random() - magicNumber);
    // o array sort seta o index de acordo com o resultado da callback, no caso aleatório por causa do math random.
    // o 0.5 se da para impor um parametro entre 0 e 1, de modo a ser uma média entre os limites.
    return randomAnswers.map((answer) => {
      if (answer === element.correct_answer) {
        return (
          <label
            htmlFor={ answer }
            key={ answer }
          >
            { answer }
            <input
              type="radio"
              id={ answer }
              name="question"
              value={ answer }
              data-testid="correct-answer"
              // onChange={ this.handleChange }
            />
          </label>
        );
      }
      return (
        <label
          htmlFor={ answer }
          key={ answer }
        >
          { answer }
          <input
            type="radio"
            id={ answer }
            name="question"
            value={ answer }
            data-testid="wrong-answer"
            // onChange={ this.handleChange }
          />
        </label>
      );
    });
  }

  render() {
    const { name, email } = this.props;
    return (
      <div>
        <header data-testid="header-profile-picture">
          <img
            src={ getGravatar(email) }
            data-testid="header-profile-picture"
            alt="avatar"
          />
          <h3 data-testid="header-player-name">{ name }</h3>
          <h4 data-testid="header-score">0</h4>
        </header>
        <section>
          { this.renderQuestions() }
        </section>
      </div>
    );
  }
}

Game.propTypes = {
  dispatchGetQuestions: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  questions: PropTypes.shape({
    category: PropTypes.string,
    correct_answer: PropTypes.string,
    incorrect_answer: PropTypes.arrayOf(PropTypes.string),
    length: PropTypes.number,
    map: PropTypes.func,
    question: PropTypes.string,
  }).isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  name: state.loginReducer.playerName,
  email: state.loginReducer.playerEmail,
  questions: state.questionsReducer.questions,
  token: state.loginReducer.token,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchGetQuestions: (token) => dispatch(getQuestions(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
