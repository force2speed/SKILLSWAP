// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkillSwap is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 private _nextOfferId;

    struct Offer {
        uint256 id;
        address provider;
        string skillOffered;
        string skillRequested;
        string description;   // added
        uint256 duration;     // added
        bool isActive;
    }

    struct Review {
        address reviewer;
        uint8 rating;
        string comment;
    }
    struct Match {
    uint256 offerId;
    address requester;
    bool confirmed;
}


    mapping(uint256 => Offer) public offers;
    mapping(address => uint256) public reputation;
    mapping(address => Review[]) public reviews;

    event SkillPosted(uint256 offerId, address indexed provider, string skillOffered, string skillRequested);
    event OfferCompleted(uint256 offerId, address indexed provider, address indexed receiver);
    event ReviewSubmitted(address indexed reviewer, address indexed reviewee, uint8 rating, string comment);
    event BadgeMinted(address indexed user, uint256 tokenId, string tokenURI);

    constructor() ERC721("SkillSwapBadge", "SSB") {}

    // ✅ single correct postSkill with description + duration
    function postSkill(
        string memory _skillOffered,
        string memory _skillRequested,
        string memory _description,
        uint256 _duration
    ) external {
        require(bytes(_skillOffered).length > 0, "Skill offered required");
        require(bytes(_skillRequested).length > 0, "Skill requested required");

        uint256 offerId = _nextOfferId++;
        offers[offerId] = Offer({
            id: offerId,
            provider: msg.sender,
            skillOffered: _skillOffered,
            skillRequested: _skillRequested,
            description: _description,
            duration: _duration,
            isActive: true
        });

        emit SkillPosted(offerId, msg.sender, _skillOffered, _skillRequested);
    }

    function getActiveOffers() external view returns (Offer[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < _nextOfferId; i++) {
            if (offers[i].isActive) count++;
        }

        Offer[] memory activeOffers = new Offer[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < _nextOfferId; i++) {
            if (offers[i].isActive) {
                activeOffers[index] = offers[i];
                index++;
            }
        }
        return activeOffers;
    }

    function completeOffer(uint256 _offerId) external {
        Offer storage offer = offers[_offerId];
        require(offer.isActive, "Offer not active");
        require(msg.sender != offer.provider, "Provider cannot complete own offer");

        offer.isActive = false;
        reputation[offer.provider] += 10;

        emit OfferCompleted(_offerId, offer.provider, msg.sender);
    }

    function leaveReview(address _reviewee, uint8 _rating, string calldata _comment) external {
        require(_rating >= 1 && _rating <= 5, "Invalid rating");

        reviews[_reviewee].push(Review({
            reviewer: msg.sender,
            rating: _rating,
            comment: _comment
        }));

        if (_rating >= 4) {
            reputation[_reviewee] += 5;
        } else if (_rating == 1 && reputation[_reviewee] > 0) {
            reputation[_reviewee] -= 2;
        }

        emit ReviewSubmitted(msg.sender, _reviewee, _rating, _comment);
    }

    function mintBadge(string memory tokenURI) external {
        require(reputation[msg.sender] >= 50, "Not enough reputation");

        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit BadgeMinted(msg.sender, tokenId, tokenURI);
    }

    function getReviews(address _user) external view returns (Review[] memory) {
        return reviews[_user];
    }
}
