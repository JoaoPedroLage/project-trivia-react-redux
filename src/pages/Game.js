import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getApi, getQuestions } from '../redux/actions/gameAction';
import getGravatar from '../services/gravatar';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      answer: '',
      answerIndex: 0,
      isVerified: false,
      timer: 30,
      assertions: 0,
      score: 0,
    };

    this.renderQuestions = this.renderQuestions.bind(this);
    this.renderAnswer = this.renderAnswer.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.verifyAnswer = this.verifyAnswer.bind(this);
    this.creatTimer = this.createTimer.bind(this);
  }

  componentDidMount() {
    const { dispatchGetQuestions, token } = this.props;
    dispatchGetQuestions(token);

    this.createTimer();

    const state = { player: {
      name: '', assertions: 0, score: 0, gravatarEmail: '',
    } };
    localStorage.setItem('state', JSON.stringify(state));
  }

  componentDidUpdate() {
    const { userName, userEmail } = this.props;
    const { assertions, score, timer } = this.state;
    const TIME_LIMIT = 0;
    if (timer === TIME_LIMIT) {
      clearInterval(this.gameTimer);
    }

    const state = { player: {
      name: userName, assertions, score, gravatarEmail: userEmail,
    } };
    localStorage.setItem('state', JSON.stringify(state));
  }

  handleClick({ target }) {
    clearInterval(this.gameTimer);
    const { value } = target;
    this.setState({ answer: value }, () => {
      this.verifyAnswer();
      this.countCorrectAnswers();
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

  createTimer() {
    const ONE_SECOND = 1000;
    // this.timer para ter alcance global.
    this.gameTimer = setInterval(() => {
      this.setState((prevState) => ({
        timer: prevState.timer - 1,
      }));
    }, ONE_SECOND);
  }

  countCorrectAnswers() {
    const { answer, answerIndex, timer } = this.state;
    const { questions } = this.props;
    const levelsList = { hard: 3, medium: 2, easy: 1 };
    let level;
    const { difficulty } = questions[answerIndex];
    const baseScore = 10;

    if (difficulty === 'hard') {
      level = levelsList.hard;
    } else if (difficulty === 'medium') {
      level = levelsList.medium;
    } else { level = levelsList.easy; }

    if (answer === 'correct-answer') {
      const computation = baseScore + (timer + level);

      this.setState((prevState) => ({
        assertions: prevState.assertions + 1,
        score: prevState.score + computation,
      }));
    }
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
    const answers = [element.correct_answer, ...element.incorrect_answers];
    const randomAnswers = answers.sort();
    const timeOut = timer === 0;
    return randomAnswers.map((quest, i) => {
      if (quest === element.correct_answer) {
        return (
          <button
            type="button"
            name="question"
            value="correct-answer"
            data-testid="correct-answer"
            disabled={ disabled }
            style={ isVerified || timeOut ? {
              border: '3px solid rgb(6, 240, 15)' } : null }
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
          style={ isVerified || timeOut ? {
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
  token: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  userName: state.loginReducer.playerName,
  userEmail: state.loginReducer.playerEmail,
  questions: state.questionsReducer.questions,
  token: state.loginReducer.token,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchGetQuestions: (token) => dispatch(getQuestions(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
