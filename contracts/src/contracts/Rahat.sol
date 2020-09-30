pragma solidity 0.6.4;
import './AidToken.sol';

contract Rahat is AccessControl {
	//***** Events *********//
	event Claimed(address indexed vendor, uint256 indexed phone, uint256 amount);
	event ClaimApproved(address indexed vendor, uint256 indexed phone, uint256 amount);
	event Issued(bytes32 indexed projectId, uint64 indexed phone, uint256 amount);
	//event BalanceAdjusted(uint64 indexed phone, uint256 amount, string reason);

	//***** Constant Variables (Roles) *********//
	bytes32 public constant SERVER_ROLE = keccak256('SERVER');
	bytes32 public constant VENDOR_ROLE = keccak256('VENDOR');

	//***** Variables (State) *********//
	AidToken public tokenContract;
	/// @notice track balances of each beneficiary phones
	mapping(uint64 => uint64) public tokenBalance;

	/// @notice track projectBalances
	bytes32[] public projectId;
	mapping(bytes32 => uint64) remainingProjectBalances;

	struct claim {
		uint64 amount;
		bytes32 otpHash;
		bool isReleased;
		uint256 date;
	}
	/// @dev vendorAddress => phone => claim
	mapping(address => mapping(uint256 => claim)) public recentClaims;

	//***** Constructor *********//
	constructor(AidToken _tokenContract, address _admin) public {
		_setupRole(DEFAULT_ADMIN_ROLE, tx.origin);
		_setupRole(DEFAULT_ADMIN_ROLE, _admin);
		_setRoleAdmin(SERVER_ROLE, DEFAULT_ADMIN_ROLE);
		_setRoleAdmin(VENDOR_ROLE, DEFAULT_ADMIN_ROLE);
		grantRole(SERVER_ROLE, msg.sender);
		tokenContract = _tokenContract;
	}

	//***** Modifiers *********//
	modifier OnlyServer() {
		require(hasRole(SERVER_ROLE, msg.sender), 'RAHAT: Sender must be an authorized server');
		_;
	}
	modifier OnlyAdmin {
		require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), 'RAHAT: Sender must be an admin.');
		_;
	}
	modifier IsBeneficiary(uint64 _phone) {
		require(tokenBalance[_phone] != 0, 'RAHAT: No any token was issued to this number');
		_;
	}
	modifier OnlyVendor {
		require(hasRole(VENDOR_ROLE, msg.sender), 'RAHAT: Sender Must be a registered vendor.');
		_;
	}

	//***** Methods *********//
	//Access Control Management
	/// @notice add admin of the this contract
	/// @param _account address of the new admin
	function addAdmin(address _account) public {
		grantRole(DEFAULT_ADMIN_ROLE, _account);
	}

	/// @notice add server account for this contract
	/// @param _account address of the new server account
	function addServer(address _account) public {
		grantRole(SERVER_ROLE, _account);
	}

	/// @notice add vendors
	/// @param _account address of the new vendor
	function addVendor(address _account) public {
		grantRole(VENDOR_ROLE, _account);
	}

	//Beneficiary Management
	/// @notice suspend the benficiary by deducting all the balance beneficiary owns
	/// @param _phone phone number of the Beneficiary
	function suspendBeneficiary(uint64 _phone) public OnlyServer IsBeneficiary(_phone) {
		uint64 _balance = tokenBalance[_phone];
		adjustTokenDeduct(_phone, _balance);
	}

	/// @notice adds the token from beneficiary
	function adjustTokenAdd(uint64 _phone, uint64 _amount) public OnlyAdmin {
		tokenBalance[_phone] = tokenBalance[_phone] + _amount;
		//emit BalanceAdjusted(_phone, _amount, _reason);
	}

	/// @notice deducts the token from beneficiary
	function adjustTokenDeduct(uint64 _phone, uint64 _amount) public OnlyAdmin IsBeneficiary(_phone) {
		tokenBalance[_phone] = tokenBalance[_phone] - _amount;
		//emit BalanceAdjusted(_phone, _amount, _reason);
	}

	/// @notice creates a project.
	/// @notice called by rahatdmin contract
	/// @param _projectId Id of the project to assign budget
	/// @param _projectCapital amount of budget to be assigned to project
	function addProject(bytes32 _projectId, uint64 _projectCapital) external {
		projectId.push(_projectId);
		remainingProjectBalances[_projectId] = _projectCapital;
	}

	/// @notice update a project balance.
	/// @notice called by rahatdmin contract
	/// @param _projectId Id of the project to assign budget
	/// @param _projectCapital amount of budget to be added to project
	function updateProjectBudget(bytes32 _projectId, uint64 _projectCapital) external {
		remainingProjectBalances[_projectId] += _projectCapital;
	}

	/// @notice get the current balance of project
	function getProjectBalance(bytes32 _projectId) external view returns (uint64 _balance) {
		return remainingProjectBalances[_projectId];
	}

	/// @notice Issue tokens to beneficiary
	/// @param _projectId Id of the project beneficiary is involved in
	/// @param _phone phone number of the beneficiary
	/// @param _amount Amount of token to be assigned to beneficiary
	function issueToken(
		string memory _projectId,
		uint64 _phone,
		uint64 _amount
	) public OnlyAdmin {
		bytes32 _id = findHash(_projectId);
		require(remainingProjectBalances[_id] >= _amount, 'RAHAT: Amount is greater than remaining Project Budget');
		remainingProjectBalances[_id] -= _amount;
		adjustTokenAdd(_phone, _amount);

		emit Issued(_id, _phone, _amount);
	}

	/// @notice Issue tokens to beneficiary in bulk
	/// @param _projectId Id of the project beneficiary is involved in
	/// @param _phone array of phone number of the beneficiary
	/// @param _amount array of Amount of token to be assigned to beneficiary
	function issueBulkToken(
		string memory _projectId,
		uint64[] memory _phone,
		uint64[] memory _amount
	) public OnlyAdmin {
		require(_phone.length == _amount.length, 'RAHAT: Invalid input arrays of Phone and Amount');
		uint64 i;
		uint64 sum = getArraySum(_amount);
		bytes32 _id = findHash(_projectId);

		require(remainingProjectBalances[_id] >= sum, 'RAHAT: Amount is greater than remaining Project Budget');

		for (i = 0; i < _phone.length; i++) {
			issueToken(_projectId, _phone[i], _amount[i]);
		}
	}

	/// @notice request a token to beneficiary by vendor
	/// @param _phone Phone number of beneficiary to whom token is requested
	/// @param _tokens Number of tokens to request
	function createClaim(uint64 _phone, uint64 _tokens) public IsBeneficiary(_phone) OnlyVendor {
		require(tokenBalance[_phone] >= _tokens, 'RAHAT: Amount requested is greater than beneficiary balance.');
		claim storage ac = recentClaims[msg.sender][_phone];
		ac.isReleased = false;
		ac.amount = _tokens;
		ac.date = block.timestamp;
		emit Claimed(tx.origin, _phone, _tokens);
	}

	/// @notice Approve the requested claim from serverside and set the otp hash
	/// @param _vendor Address of the vendor who requested the token from beneficiary
	/// @param _phone Phone number of the beneficiary, to whom token request was sent
	/// @param _otpHash Hash of OTP sent to beneficiary by server
	function approveClaim(
		address _vendor,
		uint64 _phone,
		bytes32 _otpHash,
		uint256 _timeToLive
	) public IsBeneficiary(_phone) OnlyServer {
		claim storage ac = recentClaims[_vendor][_phone];
		require(ac.date != 0, 'RAHAT: Claim has not been created yet');
		require(_timeToLive <= 86400, 'RAHAT:Time To Live should be less than 24 hours');
		require(block.timestamp <= ac.date + 86400, 'RAHAT: Claim is older than 24 hours');
		require(!ac.isReleased, 'RAHAT: Claim has already been released.');
		ac.otpHash = _otpHash;
		ac.isReleased = true;
		ac.date = block.timestamp + _timeToLive;
		emit ClaimApproved(_vendor, _phone, ac.amount);
	}

	/// @notice Retrieve tokens that was requested to beneficiary by entering OTP
	/// @param _phone Phone Number of the beneficiary, to whom token request was sent
	/// @param _otp OTP sent by the server
	function getTokensFromClaim(uint64 _phone, string memory _otp) public IsBeneficiary(_phone) OnlyVendor {
		claim storage ac = recentClaims[msg.sender][_phone];

		require(ac.isReleased, 'RAHAT: Claim has not been released.');
		require(ac.date >= block.timestamp, 'RAHAT: Claim has already expired.');
		bytes32 otpHash = findHash(_otp);
		require(recentClaims[msg.sender][_phone].otpHash == otpHash, 'RAHAT: OTP did not match.');
		require(tokenContract.transfer(msg.sender, ac.amount), 'RAHAT: Internal Error: Cannot transfer token.');
		tokenBalance[_phone] -= ac.amount;
		ac.isReleased = false;
		ac.amount = 0;
		ac.date = 0;
	}

	/// @notice generates the hash of the given string
	/// @param _data String of which hash is to be generated
	function findHash(string memory _data) private pure returns (bytes32) {
		return keccak256(abi.encodePacked(_data));
	}

	/// @notice Generates the sum of all the integers in array
	/// @param _array Array of uint
	function getArraySum(uint64[] memory _array) public pure returns (uint64 sum) {
		sum = 0;
		for (uint64 i = 0; i < _array.length; i++) {
			sum += _array[i];
		}
		return sum;
	}
}
