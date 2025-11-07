// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DigitalProductPassport
 * @dev NFT contract for Digital Product Passports on Sakshi platform
 * Each NFT represents a unique product with its complete lifecycle history
 */
contract DigitalProductPassport is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping from token ID to product ID on Sakshi platform
    mapping(uint256 => uint256) public tokenToProductId;
    
    // Mapping from product ID to token ID
    mapping(uint256 => uint256) public productIdToToken;
    
    // Mapping from token ID to impact score
    mapping(uint256 => uint256) public impactScores;

    // Events
    event DPPMinted(uint256 indexed tokenId, uint256 indexed productId, address indexed owner);
    event ImpactScoreUpdated(uint256 indexed tokenId, uint256 newScore);
    event OwnershipTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor() ERC721("Sakshi Digital Product Passport", "SDPP") Ownable(msg.sender) {}

    /**
     * @dev Mint a new DPP NFT
     * @param productId The ID of the product on Sakshi platform
     * @param recipient The address that will receive the NFT
     * @param tokenURI The metadata URI for the NFT
     * @return The newly minted token ID
     */
    function mintDPP(
        uint256 productId,
        address recipient,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        require(productIdToToken[productId] == 0, "DPP already exists for this product");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        tokenToProductId[newTokenId] = productId;
        productIdToToken[productId] = newTokenId;
        impactScores[newTokenId] = 0;

        emit DPPMinted(newTokenId, productId, recipient);

        return newTokenId;
    }

    /**
     * @dev Update the impact score for a DPP
     * @param tokenId The token ID
     * @param newScore The new impact score
     */
    function updateImpactScore(uint256 tokenId, uint256 newScore) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        impactScores[tokenId] = newScore;
        emit ImpactScoreUpdated(tokenId, newScore);
    }

    /**
     * @dev Update the metadata URI for a DPP
     * @param tokenId The token ID
     * @param newTokenURI The new metadata URI
     */
    function updateTokenURI(uint256 tokenId, string memory newTokenURI) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        _setTokenURI(tokenId, newTokenURI);
    }

    /**
     * @dev Get the product ID for a given token
     * @param tokenId The token ID
     * @return The product ID
     */
    function getProductId(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenToProductId[tokenId];
    }

    /**
     * @dev Get the token ID for a given product
     * @param productId The product ID
     * @return The token ID
     */
    function getTokenByProductId(uint256 productId) public view returns (uint256) {
        uint256 tokenId = productIdToToken[productId];
        require(tokenId != 0, "No DPP exists for this product");
        return tokenId;
    }

    /**
     * @dev Get the impact score for a token
     * @param tokenId The token ID
     * @return The impact score
     */
    function getImpactScore(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return impactScores[tokenId];
    }

    /**
     * @dev Override transfer to emit custom event
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        address previousOwner = super._update(to, tokenId, auth);
        
        if (from != address(0) && to != address(0)) {
            emit OwnershipTransferred(tokenId, from, to);
        }
        
        return previousOwner;
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
