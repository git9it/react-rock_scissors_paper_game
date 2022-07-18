import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import RspGame from '../artifacts/RspGame.sol/RspGame.json';
import SimpleAlert from '../components/SimpleAlert';

function Game() {
  const [data, setData] = useState({
    betValue: '',
  });
  const [userBet, setUserBet] = useState(0);
  const [botBet, setBotBet] = useState(3);
  const [roundResults, setRoundResults] = useState(3);

  //web3states
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState('');

  const initConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const newSigner = provider.getSigner();
      setAccount(accounts[0]);
      setContract(
        new ethers.Contract(
          '0x71C95911E9a5D330f4D621842EC243EE1343292e',
          RspGame.abi,
          newSigner
        )
      );
    } else {
      console.log('Need the metamask extension for play!');
    }
  };

  const checkEvents = async () => {
    const filter = contract.filters.GameResultsEvent(account);
    contract.on(
      filter,
      (_userwallet, _userBet, _userChoice, _botChoice, _roundWinner) => {
        setBotBet(_botChoice.toNumber());
        setRoundResults(_roundWinner.toNumber());
        console.log(
          _userwallet,
          _userBet.toString(),
          _userChoice.toString(),
          _botChoice.toString(),
          _roundWinner.toString()
        );
      }
    );
  };

  useEffect(() => {
    initConnection();
  }, []);

  const getF = async () => {
    let res = await contract.getFunds();
    console.log(res.toString());
    console.log(account);
  };
  const playGame = async () => {
    setBotBet(3);
    let res = await contract.roundResults(`${userBet}`, {
      value: ethers.utils.parseUnits(`${data.betValue}`, 'wei'),
    });
    await res.wait();
    console.log(res);
    checkEvents();
    getBalance();
  };

  const claim = async () => {
    let res = await contract.claim(balance);
  };

  const getBalance = async () => {
    let res = await contract.winnersMap(account);
    // await res.wait();
    console.log(res.toString());
    setBalance(res.toString());
  };

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
  }
  function decrementValue() {
    if (userBet == 0) {
      return setUserBet(2);
    }
    setUserBet(userBet - 1);
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
        <button className="btn" onClick={() => playGame()}>
          Играть!
        </button>
      </div>
      <SimpleAlert
        classname={
          roundResults == 1 || roundResults == 2
            ? 'ui-alert win'
            : 'ui-alert defeat'
        }
        roundResults={roundResults}
      />
      <div className="ui-balance">
        Баланс: {balance}
        <button className="btn" onClick={() => claim()}>
          ПОЛУЧИТЬ
        </button>
      </div>
    </div>
  );
}

export default Game;
