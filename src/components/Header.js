import React from 'react';

function Header({ balance, claim, initConnection, contract }) {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">КНБ RinkebyETH</div>
        <ul className="nav">
          <li>
            <a onClick={console.log('click')} href="#">
              Правила
            </a>
          </li>
          <li>
            <a href="https://rinkebyfaucet.com/" target="_blank">
              Rinkeby кран
            </a>
          </li>
          <li>
            {!contract ? (
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
