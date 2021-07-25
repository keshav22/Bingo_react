import { useEffect, useState } from "react";
import "./bingoCard.css";

function BingoCard({ player, questionsDrawn }) {
  useEffect(() => {}, []);

  const getBgColor = (question, index) => {
    if (index != 12 && questionsDrawn.includes(question)) {
      return "#f9ff00";
    }
    return "#fff";
  };

  return (
    <div class="Card col-md-6 col-12">
      <div>
        <span
          style={{
            fontSize: 30,
          }}
        >
          {player.playerName}
        </span>
        {[0, 1, 2, 3, 4].map((row) => {
          return (
            <div className="row">
              {[0, 1, 2, 3, 4].map((column) => {
                return (
                  <div
                    class="col"
                    style={{
                      backgroundColor: getBgColor(
                        player.playerQuestions[row * 5 + column],
                        row * 5 + column
                      ),
                    }}
                  >
                    {row * 5 + column == 12 ? (
                      <span>Proxy</span>
                    ) : (
                      <span>{player.playerQuestions[row * 5 + column]}</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BingoCard;
