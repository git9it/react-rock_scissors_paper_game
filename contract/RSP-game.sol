// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract RspGame {

  event GameResultsEvent(address indexed _userwallet, uint256 _userBet, uint256 _userChoice, uint256 _botChoice, uint256 _roundWinner);
  event Deposited(address indexed payee, uint256 weiAmount);

  struct GameResults{
    address userWallet;
    uint256 userBet;
    uint256 userChoice;
    uint256 botChoice;
    uint256 roundWinner;

  }

  GameResults[] public AllGamesResults;
mapping(address => uint256) public winnersMap;

  function deposit() public payable {
  emit Deposited(msg.sender, msg.value);
  }

  function getFunds() public view returns(uint256){
        return address(this).balance;
    }


    function getRandom(uint8 _seed) private view returns(uint) {
return uint256(keccak256(abi.encodePacked(block.timestamp, _seed))) % 3;
    }
    
function roundResults(uint256 _userChoice) public payable  returns(GameResults[] memory){
   uint256 botChoice = getRandom(11);
   uint256 userBet = msg.value;
   address userWallet = msg.sender;
   uint256 roundWinner = checkWinner(_userChoice, botChoice);
   GameResults memory newGameResults = GameResults(userWallet, userBet, _userChoice, botChoice, roundWinner);
   AllGamesResults.push(newGameResults);
   emit GameResultsEvent(userWallet, userBet, _userChoice, botChoice, roundWinner);
    if(roundWinner == 0){
    return AllGamesResults;
  }
    if(roundWinner == 1){
    winnersMap[userWallet] += userBet * 2;
    return AllGamesResults;
  }
    winnersMap[userWallet] += userBet;
    return AllGamesResults;
  
}

function checkWinner(uint256 _userChoice, uint256 _botChoice) public pure returns(uint){

 
if(_userChoice == _botChoice){
  return 2;
}
if(_userChoice == 0 && _botChoice == 1 || _userChoice == 1 && _botChoice == 2 || _userChoice == 2 && _botChoice == 0 ){
  return 1;
}
return 0;
}

function claim(uint256 _amount) public payable{
  require(winnersMap[msg.sender] >= _amount, "You are trying to claim the wrong amount!");
  require(address(this).balance >= _amount, "Sorry! Contract balance is lower then your request");
(bool success, ) = payable(msg.sender).call{value: _amount}("");
if(success){
  winnersMap[msg.sender] -= _amount;
}
}



}

