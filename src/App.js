import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import Game from './pages/Game';
import Header from './components/Header';
import Footer from './components/Footer';
import RspGame from './artifacts/RspGame.sol/RspGame.json';
import { useAppContext } from './context/appContext';

function App() {
  const { notify } = useAppContext();
  //web3states
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState('');
  const [contractBalance, setContractBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);


  const getBalance = async () => {
    let res = await contract.winnersMap(account);
    setBalance(res.toString());
  };

  const claim = async () => {
    await contract.claim(balance);
    setBalance(0);
  };

  const getContractBalance = async () => {
    let res = await contract.getFunds();
    setContractBalance(res.toString());
    return res.toString();
  };

  const initConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 5) {
        notify('Для игры необходимо выбрать сеть Goerli');
      } else {
        const newSigner = provider.getSigner();
        setAccount(accounts[0]);
        setContract(
          new ethers.Contract(
            '0xC4C622cDcC2978ae1cfDDA15CD3C757f5Cf76D17',
            RspGame.abi,
            newSigner
          )
        );
        setIsConnected(true);
      }
    } else {
      notify('Для игры нужно расширение Metamask');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (_chainId) =>
        window.location.reload()
      );
      return () =>
        window.ethereum.removeListener('chainChanged', (_chainId) =>
          window.location.reload()
        );
    }
  }, []);

  return (
    <>
      <Header
        balance={balance}
        claim={claim}
        initConnection={initConnection}
        isConnected={isConnected}
      />
      <Game
        name={name}
        setName={setName}
        account={account}
        isConnected={isConnected}
        contract={contract}
        getBalance={getBalance}
        contractBalance={contractBalance}
        getContractBalance={getContractBalance}
      />
      <Footer />
    </>
  );
}

export default App;
