import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: "hangman",
      chancesLeft: 5,
      alphaMap: {},
      answerMap: [],
      correct: 0,
      gameOver: false,
      won: false,
      answerChoices: []
    };
  }

  componentDidMount = () => {
    this.initialize();
  };

  initialize = () => {
    const alphaMap = {};
    const answerMap = [];
    const answerChoices = [
      "hangman",
      "react",
      "extravagant",
      "icecream",
      "zebra"
    ];
    const randomInt = getRandomIntInclusive(0, answerChoices.length - 1);
    const answer = answerChoices[randomInt];
    [..."abcdefghijklmnopqrstuvwxyz"].forEach(l => {
      alphaMap[l] = {
        letter: l,
        isInAnswer: answer.includes(l),
        isUsed: false
      };
    });
    [...answer].forEach(l => {
      answerMap.push({
        letter: l,
        isRevealed: false
      });
    });
    this.setState({ answer, alphaMap, answerMap, answerChoices });
  };

  onClickLetter = l => {
    if (this.state.gameOver) return;
    // console.log("clicked ", l);
    const alphaMap = { ...this.state.alphaMap };
    const alphaObj = alphaMap[l];
    if (alphaObj.isUsed) return;
    alphaObj.isUsed = true;
    if (alphaObj.isInAnswer) {
      let correct = this.state.correct;
      const answerMap = [...this.state.answerMap];
      answerMap.forEach(a => {
        if (a.letter == l) {
          a.isRevealed = true;
          correct++;
        }
      });
      // console.log({ correct, answerLen: this.state.answer.length });
      if (correct == this.state.answer.length) {
        this.setState({ gameOver: true, won: true });
      }
      this.setState({ answerMap, correct });
    } else {
      let chancesLeft = this.state.chancesLeft;
      chancesLeft--;
      if (chancesLeft <= 0) {
        // console.log("game over");
        this.setState({ gameOver: true, won: false });
      }
      this.setState({ chancesLeft });
    }
    this.setState({ alphaMap });
  };

  onClickPlayAgain = () => {
    // console.log("play again");
    this.setState({
      chancesLeft: 5,
      correct: 0,
      gameOver: false,
      won: false
    });
    this.initialize();
  };

  render() {
    // console.log("i render");
    // const answer = [...this.state.answer];
    const alphaObjArray = Object.values(this.state.alphaMap);
    const answerObjArray = [...this.state.answerMap];
    // console.log(letterObjArray);
    // console.log(answerObjArray);
    return (
      <div id="app-container">
        <GameMessage
          won={this.state.won}
          gameOver={this.state.gameOver}
          chancesLeft={this.state.chancesLeft}
        />
        <div id="guess-container">
          {answerObjArray.map((lo, i) => {
            return (
              <GuessBox key={i} letter={lo.letter} isRevealed={lo.isRevealed} />
            );
          })}
        </div>
        <PlayAgain
          gameOver={this.state.gameOver}
          onClickPlayAgain={this.onClickPlayAgain}
        />
        <div id="letters-container">
          {alphaObjArray.map((lo, i) => {
            return (
              <LetterBox
                key={i}
                letter={lo.letter}
                isUsed={lo.isUsed}
                onClickLetter={this.onClickLetter}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

// -- Components -- //
const GuessBox = props => {
  return (
    <input
      className="guess-box"
      maxLength={"1"}
      value={props.isRevealed ? props.letter : ""}
      disabled
    />
  );
};

const LetterBox = props => {
  const css = `letter-box ${props.isUsed ? "letter-box-used" : ""}`;
  return (
    <div
      className={css}
      onClick={() => {
        if (!props.isUsed) props.onClickLetter(props.letter);
      }}
    >
      {props.letter}
    </div>
  );
};

const GameMessage = props => {
  let message = "";
  let css = "";
  if (props.gameOver && !props.won) {
    message = "Game Over!";
    css = "message-red";
  } else if (props.won) {
    message = "You Win!";
    css = "message-green";
  }

  return (
    <div>
      <div className={css} id="message-container">
        {message}
      </div>
      <div className={props.gameOver ? "hide" : ""}>
        Chances Left: <span className="message-green">{props.chancesLeft}</span>
      </div>
    </div>
  );
};

const PlayAgain = props => {
  return (
    <div id="button-container">
      <button
        className={!props.gameOver ? "hide" : ""}
        onClick={() => {
          props.onClickPlayAgain();
        }}
      >
        Play Again
      </button>
    </div>
  );
};

// -- Helpers -- //
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

ReactDOM.render(<App />, document.getElementById("root"));
