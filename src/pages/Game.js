import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getQuestions } from '../redux/actions/gameAction';
import getGravatar from '../services/gravatar';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      answer: '',
      answerIndex: 0,
      isVerified: false,
      timer: 30,
    };

    this.renderQuestions = this.renderQuestions.bind(this);
    this.renderAnswer = this.renderAnswer.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.verifyAnswer = this.verifyAnswer.bind(this);
    this.creatTimer = this.creatTimer.bind(this);
  }

  componentDidMount() {
    const { dispatchGetQuestions, token } = this.props;
    dispatchGetQuestions(token);
    this.creatTimer();
  }

  componentDidUpdate() {
    const { timer } = this.props;
    const TIME_LIMIT = 0;
    if (timer === TIME_LIMIT) {
      clearInterval(this.gameTimer);
    }
  }

  handleClick({ target }) {
    const { value } = target;
    clearInterval(this.gameTimer);
    this.setState({ answer: value }, () => {
      this.verifyAnswer();
    });
  }

  verifyAnswer() {
    const { answer } = this.state;
    if (answer !== '') {
      this.setState({
        isVerified: true,
      });
    }
  }

  creatTimer() {
    const ONE_SECOND = 1000;
    // this.timer para ter alcance global.
    this.gameTimer = setInterval(() => {
      this.setState((prevState) => ({
        timer: prevState.timer - 1,
      }));
    }, ONE_SECOND);
  }

  renderQuestions() {
    const { questions } = this.props;
    const { answerIndex, isVerified } = this.state;
    // console.log(questions);
    return (
      questions.length > 0
      && questions.map((element, index) => (
        answerIndex === index && ( // requisito 6 - o ternário faz renderizar uma questão de cada vez
          <div key={ index }>
            <h4 data-testid="question-category">
              { element.category }
            </h4>
            <h5 data-testid="question-text">
              { element.question }
            </h5>
            <section>
              { this.renderAnswer(element, isVerified) }
            </section>
          </div>
        )))
    );
  }

  renderAnswer(element, isVerified) {
    const { answer, timer } = this.state;
    const disabled = timer <= 0 || answer !== '';
    // randomificando as respostas
    const answers = [element.correct_answer, ...element.incorrect_answers];
    // referencia: https://flaviocopes.com/how-to-shuffle-array-javascript/
    const randomAnswers = answers.sort();
    // o array sort seta o index de acordo com o resultado da callback, no caso aleatório por causa do math random.
    // o 0.5 se da para impor um parametro entre 0 e 1, de modo a ser uma média entre os limites.
    return randomAnswers.map((quest, i) => {
      if (quest === element.correct_answer) {
        return (
          <button
            type="button"
            name="question"
            value="correct-answer"
            data-testid="correct-answer"
            disabled={ disabled }
            style={ isVerified ? { border: '3px solid rgb(6, 240, 15)' } : null }
            onClick={ this.handleClick }
          >
            { quest }
          </button>
        );
      }
      return (
        <button
          key={ quest }
          type="button"
          id={ quest }
          name="question"
          value="wrong-answer"
          disabled={ disabled }
          data-testid={ `wrong-answer-${i}` }
          style={ isVerified ? {
            border: '3px solid rgb(255, 0, 0)' } : null }
          onClick={ this.handleClick }
        >
          { quest }
        </button>
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
  timer: PropTypes.number.isRequired,
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
