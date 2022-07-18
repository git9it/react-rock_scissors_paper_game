import React from 'react';

function Header() {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">КНБ RinkebyETH</div>
        <ul className="nav">
          <li>
            <a href="https://rinkebyfaucet.com/" target="_blank">
              Rinkeby кран
            </a>
          </li>
          <li>
            <a href="/">Впн</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
