pragma solidity ^0.6.4;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

contract AidToken is ERC20 {
	mapping(address => bool) public owner;

	modifier OnlyOwner {
		require(owner[tx.origin], 'Only Admin can execute this transaction');
		_;
	}

	constructor(
		string memory _name,
		string memory _symbol,
		address _admin
	) public ERC20(_name, _symbol) {
		owner[msg.sender] = true;
		owner[_admin] = true;
		_mint(msg.sender, 10000);
	}

	function mintToken(address _address, uint256 _amount) public OnlyOwner returns (uint256) {
		_mint(_address, _amount);
		return _amount;
	}
}
