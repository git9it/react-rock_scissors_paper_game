import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import Game from './pages/Game';
import Header from './components/Header';
import Footer from './components/Footer';
import RspGame from './artifacts/RspGame.sol/RspGame.json';

function App() {
  //web3states
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState('');

  const getBalance = async () => {
    let res = await contract.winnersMap(account);
    setBalance(res.toString());
  };
  const claim = async () => {
    await contract.claim(balance);
    setBalance(0);
  };

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
          '0x6D6c62e6cc60535E717C7259ea2b69cbF016452B',
          RspGame.abi,
          newSigner
        )
      );
    } else {
      console.log('Need the metamask extension for play!');
    }
  };

  useEffect(() => {
    initConnection();
  }, []);

  return (
    <>
      <Header balance={balance} claim={claim} />
      <Game
        name={name}
        setName={setName}
        account={account}
        contract={contract}
        getBalance={getBalance}
      />
      <Footer />
    </>
  );
}

export default App;
