// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SakshiCoin
 * @dev ERC20 token for the Sakshi platform reward system
 * SAK tokens are earned through positive actions and can be used for discounts
 */
contract SakshiCoin is ERC20, ERC20Burnable, Ownable {
    // Maximum supply: 1 billion SAK tokens
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    
    // Mapping of authorized minters (platform contracts/addresses)
    mapping(address => bool) public authorizedMinters;
    
    // Events
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    event TokensAwarded(address indexed recipient, uint256 amount, string reason);

    constructor() ERC20("SakshiCoin", "SAK") Ownable(msg.sender) {
        // Mint initial supply to contract owner for distribution
        _mint(msg.sender, 100_000_000 * 10**18); // 100M initial supply
    }

    /**
     * @dev Authorize an address to mint tokens
     * @param minter The address to authorize
     */
    function authorizeMinter(address minter) public onlyOwner {
        require(minter != address(0), "Invalid minter address");
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }

    /**
     * @dev Revoke minting authorization from an address
     * @param minter The address to revoke
     */
    function revokeMinter(address minter) public onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }

    /**
     * @dev Mint new tokens (only authorized minters)
     * @param to The recipient address
     * @param amount The amount to mint
     */
    function mint(address to, uint256 amount) public {
        require(
            msg.sender == owner() || authorizedMinters[msg.sender],
            "Not authorized to mint"
        );
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        
        _mint(to, amount);
    }

    /**
     * @dev Award tokens to a user with a reason
     * @param recipient The recipient address
     * @param amount The amount to award
     * @param reason The reason for the award
     */
    function awardTokens(
        address recipient,
        uint256 amount,
        string memory reason
    ) public {
        require(
            msg.sender == owner() || authorizedMinters[msg.sender],
            "Not authorized to award tokens"
        );
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        
        _mint(recipient, amount);
        emit TokensAwarded(recipient, amount, reason);
    }

    /**
     * @dev Batch award tokens to multiple users
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to award
     */
    function batchAward(
        address[] memory recipients,
        uint256[] memory amounts
    ) public {
        require(
            msg.sender == owner() || authorizedMinters[msg.sender],
            "Not authorized to award tokens"
        );
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(totalSupply() + amounts[i] <= MAX_SUPPLY, "Would exceed max supply");
            _mint(recipients[i], amounts[i]);
        }
    }

    /**
     * @dev Get the number of decimals for the token
     * @return The number of decimals (18)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
