import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useAppContext } from '../context/appContext';
import SimpleAlert from '../components/SimpleAlert';
import Modal from '../components/Modal';
import { ToastContainer } from 'react-toastify';

function Game({
  contract,
  account,
  getBalance,
  isConnected,
  getContractBalance,
}) {
  const { notify } = useAppContext();

  const [data, setData] = useState({
    betValue: '',
    betUnit: 'wei',
    isBetValid: true,
  });
  const [userBet, setUserBet] = useState(0);
  const [botBet, setBotBet] = useState(3);
  const [roundResults, setRoundResults] = useState(3);
  const [loading, setLoading] = useState(false);
  let isBvalid = true;
  let betInWei;

  const checkEvents = async () => {
    const filter = contract.filters.GameResultsEvent(account);
    contract.on(
      filter,
      (_userwallet, _userBet, _userChoice, _botChoice, _roundWinner) => {
        setBotBet(_botChoice.toNumber());
        setRoundResults(_roundWinner.toNumber());
        setLoading(false);
      }
    );
  };

  const playGame = async () => {
    setRoundResults(3);
    if (data.betUnit === 'ether') {
      betInWei = data.betValue * 1000000000000000000;
    } else {
      betInWei = data.betValue;
    }
    let contractBalance = await getContractBalance();

    if (contractBalance < betInWei * 2) {
      isBvalid = false;

      notify(
        `Максимальная ставка ${(
          contractBalance /
          2 /
          1000000000000000000
        ).toFixed(2)} eth`
      );
    }

    if (!data.betValue || betInWei < 1) {
      isBvalid = false;
      notify('Минимальная ставка 1 wei');
    }
    if (isBvalid) {
      setLoading(true);
      const newdata = { ...data };

      setData(newdata);
      setBotBet(3);
      try {
        let res = await contract.roundResults(`${userBet}`, {
          value: ethers.utils.parseUnits(
            `${data.betValue}`,
            `${data.betUnit}`,
            { gasLimit: 600000 }
          ),
        });
        await res.wait();
      } catch (err) {
        setLoading(false);
        if (err.code === 'INSUFFICIENT_FUNDS') {
          notify('Недостаточно средств!');
        }
        if (err.code === 4001) {
          notify('Транкзация отклонена пользователем');
        }
        if (err.code === 'CALL_EXCEPTION') {
          notify('Ошибка транкзации, попробуйте еще раз');
        }
      }

      await checkEvents();
      await getBalance();
    }
  };

  function changeHandler(e) {
    const newdata = { ...data };
    newdata[e.target.name] = e.target.value;
    setData(newdata);
  }

  const gameItemsArr = ['Rock', 'Scissors', 'Paper'];

  function incrementValue() {
    if (userBet === 2) {
      return setUserBet(0);
    }
    setUserBet(userBet + 1);
  }
  function decrementValue() {
    if (userBet === 0) {
      return setUserBet(2);
    }
    setUserBet(userBet - 1);
  }

  const handleUnitChange = (event) => {
    const newdata = { ...data };

    newdata.betUnit = event.target.value;
    setData(newdata);
  };

  return (
    <div className="main-container">
      <ToastContainer />
      <Modal showModal={false}>123</Modal>
      <div className="ui-container">
        <div className="rows-3">
          <div className="ui-name">HUMAN</div>
          <div className="ui-rsp-image">
            <img
              alt="game element"
              src={require(`../images/${gameItemsArr[userBet]}.png`)}
            ></img>
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
            {botBet === 3 ? (
              '?'
            ) : (
              <img
                alt="game element"
                src={require(`../images/${gameItemsArr[botBet]}.png`)}
              ></img>
            )}
          </div>
          <div className="ui-rsp-choose center">
            {botBet === 3 ? '?' : gameItemsArr[botBet]}
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
          min="1"
          max={10000000}
          name="betValue"
          placeholder="bet"
        />
        {'  '}
        <select value={data.betUnit} onChange={handleUnitChange}>
          <option value="wei">Wei</option>
          {/* <option value="gwei">Gwei</option> */}
          <option value="ether">Ether</option>
        </select>
      </div>
      <div className="ui-control-container">
        Возможный выигрыш: {(data.betValue * 2).toFixed(0)} {data.betUnit}
      </div>
      <div className="ui-control-container">
        {!isConnected ? (
          'Для старта игры подключите метамаск'
        ) : (
          <button
            className="btn"
            disabled={loading ? true : false}
            onClick={() => playGame()}
          >
            {loading ? 'загрузка...' : 'Играть!'}
          </button>
        )}
      </div>

      <SimpleAlert
        classname={
          roundResults === 1 || roundResults === 2
            ? 'ui-alert win'
            : 'ui-alert defeat'
        }
        roundResults={roundResults}
        hide={loading ? true : false}
      />
    </div>
  );
}

export default Game;
