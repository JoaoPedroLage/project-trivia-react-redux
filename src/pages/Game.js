import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getQuestions } from '../redux/actions/gameAction';
import getGravatar from '../services/gravatar';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      // answer: '',
      answerIndex: 0,
    };

    this.renderQuestions = this.renderQuestions.bind(this);
    this.renderAnswer = this.renderAnswer.bind(this);
    // this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { dispatchGetQuestions, token } = this.props;
    dispatchGetQuestions(token);
  }

  // handleClick({ target }) {
  //   const { value } = target;
  //   this.setState({ answer: value });
  // }

  renderQuestions() {
    const { questions } = this.props;
    const { answerIndex } = this.state;
    console.log(questions);
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
              { this.renderAnswer(element) }
            </section>
          </div>
        )))
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
    return randomAnswers.map((answer, i) => {
      if (answer === element.correct_answer) {
        return (
          <button
            type="button"
            name="question"
            value="correct-answer"
            data-testid="correct-answer"
            onClick={ this.handleClick }
          >
            { answer }
          </button>
        );
      }
      return (
        <button
          key={ answer }
          type="button"
          id={ answer }
          name="question"
          value="wrong-answer"
          data-testid={ `wrong-answer-${i}` }
          onClick={ this.handleClick }
        >
          { answer }
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