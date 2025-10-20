// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@fhevm/solidity/FHE.sol";

contract FHEDiplomaVault {
    // Diploma struct with FHE encrypted data
    struct Diploma {
        uint256 diplomaId;           // Public ID
        string studentId;            // Public student ID
        string universityName;       // Public university name
        string degreeName;           // Public degree name
        string major;                // Public major
        string ipfsHash;             // Public IPFS hash
        address studentAddress;      // Public student address
        uint256 issueDate;           // Public issue date
        bool isVerified;             // Public verification status
        
        // FHE encrypted sensitive data
        euint32 encryptedGpa;        // Encrypted GPA
        euint32 encryptedGraduationYear; // Encrypted graduation year
        euint8 encryptedDegreeType;   // Encrypted degree type (1=Bachelor, 2=Master, 3=PhD)
        ebool encryptedIsApproved;   // Encrypted approval status
    }

    // University struct
    struct University {
        uint256 universityId;
        string name;
        string country;
        address admin;
        bool isVerified;
        bool isActive;
        uint256 registrationDate;
    }

    // Verification request struct
    struct VerificationRequest {
        address requester;           // Who requested verification
        uint256 diplomaId;           // Which diploma to verify
        string purpose;              // Purpose of verification
        bool isCompleted;            // Whether verification is completed
        uint256 requestDate;        // When request was made
        string verificationResult;   // Result of verification
    }

    // State variables
    mapping(uint256 => Diploma) private diplomas;
    mapping(uint256 => University) private universities;
    mapping(uint256 => VerificationRequest) private verificationRequests;
    
    mapping(address => bool) public isAdmin;
    mapping(address => bool) public isUniversityAdmin;
    mapping(address => uint256[]) public studentDiplomas;
    mapping(address => uint256[]) public universityVerifications;
    
    uint256 public diplomaCounter;
    uint256 public universityCounter;
    uint256 public verificationCounter;
    address public owner;

    // Events
    event DiplomaCreated(uint256 indexed diplomaId, address indexed student, string universityName);
    event UniversityRegistered(uint256 indexed universityId, address indexed admin, string name);
    event VerificationRequested(uint256 indexed requestId, address indexed requester, uint256 diplomaId);
    event VerificationCompleted(uint256 indexed requestId, bool approved, string result);
    event DiplomaVerified(uint256 indexed diplomaId, bool verified);

    constructor() {
        owner = msg.sender;
        isAdmin[msg.sender] = true;
    }

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admin");
        _;
    }

    modifier onlyUniversityAdmin() {
        require(isUniversityAdmin[msg.sender], "Only university admin");
        _;
    }

    // Admin functions
    function addAdmin(address _admin) public onlyOwner {
        isAdmin[_admin] = true;
    }

    function addUniversityAdmin(address _admin) public onlyAdmin {
        isUniversityAdmin[_admin] = true;
    }

    function registerUniversity(
        string memory _name,
        string memory _country,
        address _admin
    ) public onlyAdmin returns (uint256) {
        require(bytes(_name).length > 0, "University name cannot be empty");
        require(_admin != address(0), "Invalid admin address");
        require(!isUniversityAdmin[_admin], "Address already registered as university admin");
        
        uint256 universityId = universityCounter++;
        
        universities[universityId] = University({
            universityId: universityId,
            name: _name,
            country: _country,
            admin: _admin,
            isVerified: true,
            isActive: true,
            registrationDate: block.timestamp
        });
        
        isUniversityAdmin[_admin] = true;
        emit UniversityRegistered(universityId, _admin, _name);
        return universityId;
    }

    // Student creates diploma (encrypted)
    function createDiploma(
        string memory _studentId,
        string memory _universityName,
        string memory _degreeName,
        string memory _major,
        string memory _ipfsHash,
        externalEuint32 _encryptedGpa,
        externalEuint32 _encryptedGraduationYear,
        externalEuint8 _encryptedDegreeType,
        externalEbool _encryptedIsApproved
    ) public returns (uint256) {
        require(bytes(_studentId).length > 0, "Student ID cannot be empty");
        require(bytes(_universityName).length > 0, "University name cannot be empty");
        require(bytes(_degreeName).length > 0, "Degree name cannot be empty");
        
        uint256 diplomaId = diplomaCounter++;
        
        diplomas[diplomaId] = Diploma({
            diplomaId: diplomaId,
            studentId: _studentId,
            universityName: _universityName,
            degreeName: _degreeName,
            major: _major,
            ipfsHash: _ipfsHash,
            studentAddress: msg.sender,
            issueDate: block.timestamp,
            isVerified: false,
            encryptedGpa: FHE.fromExternal(_encryptedGpa),
            encryptedGraduationYear: FHE.fromExternal(_encryptedGraduationYear),
            encryptedDegreeType: FHE.fromExternal(_encryptedDegreeType),
            encryptedIsApproved: FHE.fromExternal(_encryptedIsApproved)
        });
        
        studentDiplomas[msg.sender].push(diplomaId);
        emit DiplomaCreated(diplomaId, msg.sender, _universityName);
        return diplomaId;
    }

    // University admin verifies diploma (can decrypt)
    function verifyDiploma(
        uint256 _diplomaId,
        bool _approved,
        string memory _verificationNotes
    ) public onlyUniversityAdmin {
        require(_diplomaId < diplomaCounter, "Diploma does not exist");
        
        diplomas[_diplomaId].isVerified = _approved;
        universityVerifications[msg.sender].push(_diplomaId);
        
        emit DiplomaVerified(_diplomaId, _approved);
    }

    // Employer requests verification (cannot see sensitive data)
    function requestVerification(
        uint256 _diplomaId,
        string memory _purpose
    ) public returns (uint256) {
        require(_diplomaId < diplomaCounter, "Diploma does not exist");
        
        uint256 requestId = verificationCounter++;
        
        verificationRequests[requestId] = VerificationRequest({
            requester: msg.sender,
            diplomaId: _diplomaId,
            purpose: _purpose,
            isCompleted: false,
            requestDate: block.timestamp,
            verificationResult: ""
        });
        
        emit VerificationRequested(requestId, msg.sender, _diplomaId);
        return requestId;
    }

    // University admin responds to verification request
    function respondToVerification(
        uint256 _requestId,
        bool _approved,
        string memory _result
    ) public onlyUniversityAdmin {
        require(_requestId < verificationCounter, "Request does not exist");
        require(!verificationRequests[_requestId].isCompleted, "Request already completed");
        
        verificationRequests[_requestId].isCompleted = true;
        verificationRequests[_requestId].verificationResult = _result;
        
        if (_approved) {
            diplomas[verificationRequests[_requestId].diplomaId].isVerified = true;
        }
        
        emit VerificationCompleted(_requestId, _approved, _result);
    }

    // View functions for public data
    function getDiplomaPublicData(uint256 _diplomaId) public view returns (
        uint256 diplomaId,
        string memory studentId,
        string memory universityName,
        string memory degreeName,
        string memory major,
        string memory ipfsHash,
        address studentAddress,
        uint256 issueDate,
        bool isVerified
    ) {
        require(_diplomaId < diplomaCounter, "Diploma does not exist");
        Diploma memory diploma = diplomas[_diplomaId];
        
        return (
            diploma.diplomaId,
            diploma.studentId,
            diploma.universityName,
            diploma.degreeName,
            diploma.major,
            diploma.ipfsHash,
            diploma.studentAddress,
            diploma.issueDate,
            diploma.isVerified
        );
    }

    function getStudentDiplomas(address _student) public view returns (uint256[] memory) {
        return studentDiplomas[_student];
    }

    function getVerificationRequest(uint256 _requestId) public view returns (
        address requester,
        uint256 diplomaId,
        string memory purpose,
        bool isCompleted,
        uint256 requestDate,
        string memory verificationResult
    ) {
        require(_requestId < verificationCounter, "Request does not exist");
        VerificationRequest memory request = verificationRequests[_requestId];
        
        return (
            request.requester,
            request.diplomaId,
            request.purpose,
            request.isCompleted,
            request.requestDate,
            request.verificationResult
        );
    }

    function getUniversityInfo(uint256 _universityId) public view returns (
        uint256 universityId,
        string memory name,
        string memory country,
        address admin,
        bool isVerified,
        bool isActive,
        uint256 registrationDate
    ) {
        require(_universityId < universityCounter, "University does not exist");
        University memory university = universities[_universityId];
        
        return (
            university.universityId,
            university.name,
            university.country,
            university.admin,
            university.isVerified,
            university.isActive,
            university.registrationDate
        );
    }

    function getAllUniversities() public view returns (uint256[] memory) {
        uint256[] memory universityIds = new uint256[](universityCounter);
        for (uint256 i = 0; i < universityCounter; i++) {
            universityIds[i] = i;
        }
        return universityIds;
    }

    // FHE encrypted data getters (for university admins only)
    function getDiplomaEncryptedData(uint256 _diplomaId) public view onlyUniversityAdmin returns (
        euint32 encryptedGpa,
        euint32 encryptedGraduationYear,
        euint8 encryptedDegreeType,
        ebool encryptedIsApproved
    ) {
        require(_diplomaId < diplomaCounter, "Diploma does not exist");
        Diploma memory diploma = diplomas[_diplomaId];
        
        return (
            diploma.encryptedGpa,
            diploma.encryptedGraduationYear,
            diploma.encryptedDegreeType,
            diploma.encryptedIsApproved
        );
    }
}