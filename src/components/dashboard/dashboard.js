import { useEffect, useState } from "react";
import { COMMON_CONSTANTS } from "../../assets/constants/constants";
import BingoCard from "../bingoCard/bingoCard";
import "./dashboard.css";
import bubbleHeader from "../../assets/gifs/bubbleHead.png";
import winHeader from "../../assets/gifs/winHeader.gif";
import win1 from "../../assets/gifs/win1.gif";
import AddIcon from "@material-ui/icons/Add";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: "100%",
//     "& > * + *": {
//       marginTop: theme.spacing(2),
//     },
//   },
// }));

var QUESTION_BANK_SELECTED = [];
var vertical = "top";
var horizontal = "center";
export default function Dashboard() {
  const QUESTION_BANK = COMMON_CONSTANTS.QUESTION_BANK;
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showWinners, setShowWinners] = useState(false);
  const [questionsDrawn, setQuestionsDrawn] = useState([]);
  const [lastQuestionDrawn, setLastQuestionDrawn] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackType, setSnackType] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [winners, setWinners] = useState([]);

  useEffect(() => {}, []);

  const chooseRandom = (questions, size) => {
    var tmp = Object.values({ ...questions });
    var ret = [];

    for (var i = 0; i < size; i++) {
      var index = Math.floor(Math.random() * tmp.length);
      var removed = tmp.splice(index, 1);
      ret.push(removed[0]);
    }

    return ret;
  };

  const openSnack = (message, type) => {
    setSnackBarMessage(message);
    setSnackType(type);
    setSnackOpen(true);
  };

  const addPlayer = () => {
    if (gameStarted) {
      openSnack("Game in progress please reset or continue.", "warning");
      return;
    }
    let player = {
      playerName: (players.length + 1).toString(),
      playerQuestions: chooseRandom(QUESTION_BANK, 25),
      winnings: [],
    };

    QUESTION_BANK_SELECTED = QUESTION_BANK_SELECTED.concat(
      player.playerQuestions.filter((x) => !QUESTION_BANK_SELECTED.includes(x))
    );
    setPlayers(players.concat([player]));
  };

  const chooseRandomeQuestion = () => {
    if (players.length == 0) {
      openSnack("Please add some players!!!", "error");
      return;
    }
    if (QUESTION_BANK_SELECTED && QUESTION_BANK_SELECTED.length == 0) {
      openSnack("No more bingos possible please reset...", "warning");
      return;
    }
    setGameStarted(true);
    let question = chooseRandom(QUESTION_BANK_SELECTED, 1)[0];
    let drawnQuestions = questionsDrawn.concat([question]);
    setQuestionsDrawn(drawnQuestions);
    setLastQuestionDrawn(question);
    let index = QUESTION_BANK_SELECTED.findIndex((x) => x == question);
    QUESTION_BANK_SELECTED.splice(index, 1);
    setTimeout(() => {
      checkWinners(drawnQuestions);
    }, 0);
  };

  const checkWinners = (drawnQuestions) => {
    let winners = [];
    for (let i = 0; i < players.length; i++) {
      for (let j = 0; j < 5; j++) {
        let previousColumn = true;
        let k = 0;
        for (k = 0; k < 5; k++) {
          let index = j * 5 + k;
          let question = players[i].playerQuestions[index];
          if (index == 12 || isSelected(question, drawnQuestions)) {
            let columnWin = false;
            let daignoalWin = false;
            if (j == 0) {
              for (let z = 1; z < 5; z++) {
                let checkIndex = z * 5 + k;
                let question = players[i].playerQuestions[checkIndex];
                if (checkIndex == 12 || isSelected(question, drawnQuestions)) {
                  columnWin = true;
                } else {
                  columnWin = false;
                  break;
                }
              }
            }
            let cnt = 1;
            if ((j == 0 && k == 0) || (j == 0 && k == 4)) {
              if (k == 4) cnt = k - 1;
              for (let z = 1; z < 5; z++) {
                let checkIndex = z * 5 + cnt;
                if (k == 4) cnt--;
                else cnt++;
                let question = players[i].playerQuestions[checkIndex];
                if (checkIndex == 12 || isSelected(question, drawnQuestions)) {
                  daignoalWin = true;
                } else {
                  daignoalWin = false;
                  break;
                }
              }
            }

            if (columnWin || daignoalWin) {
              if (columnWin) {
                winners = winners.concat(getWinObj("column", players[i], k));
              }
              if (daignoalWin) {
                winners = winners.concat(
                  getWinObj("daigonal", players[i], cnt <= 0 ? 1 : 2)
                );
              }
            }
          } else previousColumn = false;
        }
        if (k == 5 && previousColumn) {
          winners = winners.concat(getWinObj("row", players[i], j));
        }
      }
      players[i].winnings = players[i].winnings.concat(
        winners.filter((x) => x.winnerName == players[i].playerName)
      );
      setPlayers(players);
    }
    if (winners.length > 0) {
      setWinners(winners);
      setShowWinners(true);
    }
  };

  const getWinObj = (type, player, index) => {
    if (player.winnings.length > 0) {
      let winned = player.winnings.find(
        (x) => x.winType == type && x.index == index
      );
      if (winned) return [];
    }

    return {
      winnerName: player.playerName,
      winType: type,
      index: index,
    };
  };

  const isSelected = (question, questions) => {
    if (questions.includes(question)) {
      return true;
    }
    return false;
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const getModalDisplay = () => {
    if (showWinners == true) {
      return "grid";
    }
    return "none";
  };

  const reset = () => {
    setPlayers([]);
    setQuestionsDrawn([]);
    QUESTION_BANK_SELECTED = [];
    setLastQuestionDrawn("");
    setGameStarted(false);
    setWinners([]);
  };

  return (
    <div className="dashboard">
      <div
        className="header"
        style={{
          boxShadow: "2px 1px 10px 1px #000000",
        }}
      >
        <div className="bingoLogo">
          <img src={bubbleHeader} className="headerLogo"></img>
        </div>
        <div className="draw-text">
          {lastQuestionDrawn ? lastQuestionDrawn : "Game is yet to be started"}
        </div>
        <div className="btn-draw">
          <button class="btn btn-primary btn-bingo" onClick={addPlayer}>
            <AddIcon className="addIcon"></AddIcon>
            Add player
          </button>
          <div className="btn-draw-cover">
            <button
              class="btn btn-primary btn-draw-bingo"
              style={{
                boxShadow: "2px 1px 10px 1px #000000",
              }}
              onClick={chooseRandomeQuestion}
            >
              <button class="btn btn-primary btn-draw-bingo btn-wdth-hgt">
                <span class="draw-text-inside">Draw</span>
              </button>
            </button>
          </div>
          <button class="btn btn-primary btn-bingo" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
      <div class="container">
        <div className="bingoCard col-md-12">
          {players.map((player) => {
            return (
              <BingoCard
                player={player}
                questionsDrawn={questionsDrawn}
              ></BingoCard>
            );
          })}
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackOpen}
        autoHideDuration={4000}
        onClose={handleSnackClose}
      >
        <Alert onClose={handleSnackClose} severity={snackType}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <div
        onClick={() => {
          setShowWinners(false);
          setWinners([]);
        }}
        className="overlay-bingo"
        style={{
          display: getModalDisplay(),
        }}
      >
        <div className="overlay-bingo-center">
          <img src={winHeader} className="winLogo"></img>
          <br></br>
          <br></br>
          <hr></hr>
          {winners.map((winner) => {
            return (
              <div className="winnerText">
                <div className="winner-text-cover">
                  <div>Winner : {winner.winnerName}</div>
                  <div>Winner Type : {winner.winType}</div>
                </div>
                <hr></hr>
              </div>
            );
          })}
          <img src={win1} className="winLogo"></img>
        </div>
      </div>
    </div>
  );
}
