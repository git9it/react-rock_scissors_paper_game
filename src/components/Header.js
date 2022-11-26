import React from 'react';
import { useAppContext } from '../context/appContext';

function Header({ balance, claim, initConnection, isConnected }) {
  const { notify } = useAppContext();
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">КНБ GoerliETH</div>
        <ul className="nav">
          <li>
            <a href="https://goerlifaucet.com/" target="_blank">
              Goerli кран
            </a>
          </li>
          <li>
            {!isConnected ? (
              <button className="btn small" onClick={() => initConnection()}>
                Connect Metamask
              </button>
            ) : null}
            <div className={balance ? 'ui-balance' : 'ui-balance hide'}>
              Баланс: {balance} wei
              <button
                className="btn small"
                disabled={balance === 0 ? true : false}
                onClick={() => claim()}
              >
                получить
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
