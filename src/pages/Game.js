import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import getGravatar from '../services/gravatar';

class Game extends Component {
  constructor() {
    super();
    // this.state = {
    //   answer: '',
    // };
    this.renderQuestions = this.renderQuestions.bind(this);
    this.renderAnswer = this.renderAnswer.bind(this);
    // this.handleChange = this.handleChange.bind(this);
  }

  // handleChange({ target }) {
  //   const { value } = target;
  //   this.setState({ answer: value });
  // }

  renderQuestions() {
    const { questions } = this.props;
    console.log(questions);
    return (
      questions.map((element, index) => (
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
      )
    );
    )
  }

  renderAnswer(element) {
    return (
      <>
        <label htmlFor={ element.correct_answer }>
          { element.correct_answer }
          <input
            type="radio"
            id={ element.correct_answer }
            name="question"
            value={ element.correct_answer }
            data-testid="correct-answer"
            onChange={ this.handleChange }
          />
        </label>
        {
          element.incorrect_answers.map((answer) => {
            const incorrectID = `wrong-answer-${answer}`;
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
                  value={ element.incorrect_answers }
                  data-testid={ incorrectID }
                  onChange={ this.handleChange }
                />
              </label>
            );
          })
        }
      </>
    );
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
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  questions: PropTypes.shape({
    category: PropTypes.string,
    question: PropTypes.string,
    correct_answer: PropTypes.string,
    incorrect_answer: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  name: state.loginReducer.playerName,
  email: state.loginReducer.playerEmail,
  questions: state.gameReducer.questions,
});

export default connect(mapStateToProps, null)(Game);
