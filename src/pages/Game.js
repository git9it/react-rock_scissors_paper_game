import React, { useState } from 'react';

function Game() {
  const [data, setData] = useState({
    betValue: '',
  });
  const [userBet, setUserBet] = useState(0);
  const [botBet, setBotBet] = useState(3);

  function submitHandler(e) {
    e.preventDefault();
  }
  function changeHandler(e) {
    console.log(e);
    const newdata = { ...data };
    newdata[e.target.name] = e.target.value;
    setData(newdata);
    console.log(newdata);
  }

  const gameItemsArr = ['Rock', 'Scissors', 'Paper'];

  function incrementValue() {
    if (userBet == 2) {
      return setUserBet(0);
    }
    setUserBet(userBet + 1);
    console.log(userBet);
  }
  function decrementValue() {
    if (userBet == 0) {
      return setUserBet(2);
    }
    setUserBet(userBet - 1);
    console.log(userBet);
  }

  function randomNumber() {
    setBotBet(Math.trunc(Math.random() * 3));
  }

  return (
    <div className="main-container">
      <div className="ui-container">
        <div className="rows-3">
          <div className="ui-name">HUMAN</div>
          <div className="ui-rsp-image">
            <img src={require(`../images/${gameItemsArr[userBet]}.png`)}></img>
          </div>
          <div className="ui-rsp-choose">
            <button className="btn choose" onClick={() => decrementValue()}>
              ←
            </button>
            {gameItemsArr[userBet]}
            <button className="btn choose" onClick={() => incrementValue()}>
              →
            </button>
          </div>
        </div>
        <div className="rows-vs-3">VS</div>
        <div className="rows-3">
          <div className="ui-name">MACHINE</div>
          <div className="ui-rsp-image">
            {botBet == 3 ? (
              '?'
            ) : (
              <img src={require(`../images/${gameItemsArr[botBet]}.png`)}></img>
            )}
          </div>
          <div className="ui-rsp-choose">
            {botBet == 3 ? '?' : gameItemsArr[botBet]}
          </div>
        </div>
      </div>
      <div className="ui-control-container">
        Ставка:{' '}
        <input
          onChange={(e) => changeHandler(e)}
          id="bet"
          value={data.description}
          type="number"
          name="betValue"
          placeholder="bet"
        />
        {'  '}
        wei
      </div>
      <div className="ui-control-container">
        Возможный выигрыш: {(data.betValue * 1.95).toFixed(0)} wei
      </div>
      <div className="ui-control-container">
        <button className="btn" onClick={() => randomNumber()}>
          Играть!{botBet}
        </button>
      </div>
      <div className="ui-alert win">ПОБЕДА!</div>
    </div>
  );
}

export default Game;
