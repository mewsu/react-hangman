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
      won: false
    };
  }

  componentDidMount = () => {
    const alphaMap = {};
    const answerMap = [];
    const answer = "hangman";
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
    this.setState({ answer, alphaMap, answerMap });
  };

  onClickLetter = l => {
    console.log("clicked ", l);
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
      console.log({ correct, answerLen: this.state.answer.length });
      if (correct == this.state.answer.length) {
        this.setState({ gameOver: true, won: true });
      }
      this.setState({ answerMap, correct });
    }
    this.setState({ alphaMap });
  };

  render() {
    console.log("i render");
    // const answer = [...this.state.answer];
    const alphaObjArray = Object.values(this.state.alphaMap);
    const answerObjArray = [...this.state.answerMap];
    // console.log(letterObjArray);
    console.log(answerObjArray);
    return (
      <div id="app-container">
        <GameMessage won={this.state.won} />
        <div id="guess-container">
          {answerObjArray.map((lo, i) => {
            return (
              <GuessBox key={i} letter={lo.letter} isRevealed={lo.isRevealed} />
            );
          })}
        </div>
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

const GuessBox = props => {
  return (
    <input
      className="guess-box"
      maxLength={"1"}
      value={props.isRevealed ? props.letter : ""}
      disabled={true}
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
  const message = props.won ? "You Win!" : "";
  return (
    <div className={props.won ? "message-green" : ""} id="message-container">
      {message}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
