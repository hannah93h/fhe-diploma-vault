// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, externalEuint8, ebool, externalEbool, eaddress, externalEaddress, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract FHEDiplomaVault is SepoliaConfig {
    using FHE for *;
    
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
        // Allow re-registration of university admins
        
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
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_studentId).length > 0, "Student ID cannot be empty");
        require(bytes(_universityName).length > 0, "University name cannot be empty");
        require(bytes(_degreeName).length > 0, "Degree name cannot be empty");
        
        uint256 diplomaId = diplomaCounter++;
        
        // Convert external FHE types to internal types with proof validation
        euint32 internalGpa = FHE.fromExternal(_encryptedGpa, inputProof);
        euint32 internalGraduationYear = FHE.fromExternal(_encryptedGraduationYear, inputProof);
        euint8 internalDegreeType = FHE.fromExternal(_encryptedDegreeType, inputProof);
        
        // Set diploma data step by step
        diplomas[diplomaId].diplomaId = diplomaId;
        diplomas[diplomaId].studentId = _studentId;
        diplomas[diplomaId].universityName = _universityName;
        diplomas[diplomaId].degreeName = _degreeName;
        diplomas[diplomaId].major = _major;
        diplomas[diplomaId].ipfsHash = _ipfsHash;
        diplomas[diplomaId].studentAddress = msg.sender;
        diplomas[diplomaId].issueDate = block.timestamp;
        diplomas[diplomaId].isVerified = false; // Diplomas start as unverified
        diplomas[diplomaId].encryptedGpa = internalGpa;
        diplomas[diplomaId].encryptedGraduationYear = internalGraduationYear;
        diplomas[diplomaId].encryptedDegreeType = internalDegreeType;
        
        // Set ACL permissions for decryption (following aidwell-connect pattern)
        FHE.allowThis(diplomas[diplomaId].encryptedGpa);
        FHE.allowThis(diplomas[diplomaId].encryptedGraduationYear);
        FHE.allowThis(diplomas[diplomaId].encryptedDegreeType);
        
        // Allow the student to decrypt their own data
        FHE.allow(diplomas[diplomaId].encryptedGpa, msg.sender);
        FHE.allow(diplomas[diplomaId].encryptedGraduationYear, msg.sender);
        FHE.allow(diplomas[diplomaId].encryptedDegreeType, msg.sender);
        
        // Allow university admins to decrypt (for verification purposes)
        if (isUniversityAdmin[msg.sender]) {
            FHE.allow(diplomas[diplomaId].encryptedGpa, msg.sender);
            FHE.allow(diplomas[diplomaId].encryptedGraduationYear, msg.sender);
            FHE.allow(diplomas[diplomaId].encryptedDegreeType, msg.sender);
        }
        
        // For now, allow anyone to decrypt (for demo purposes)
        // In production, you might want to implement a more sophisticated ACL system
        FHE.allow(diplomas[diplomaId].encryptedGpa, address(0)); // Allow anyone to decrypt GPA
        FHE.allow(diplomas[diplomaId].encryptedGraduationYear, address(0)); // Allow anyone to decrypt graduation year
        FHE.allow(diplomas[diplomaId].encryptedDegreeType, address(0)); // Allow anyone to decrypt degree type
        
        studentDiplomas[msg.sender].push(diplomaId);
        emit DiplomaCreated(diplomaId, msg.sender, "University");
        return diplomaId;
    }

    // Helper function to set basic diploma data
    function _setDiplomaBasicData(
        uint256 _diplomaId,
        string memory _studentId,
        string memory _universityName,
        string memory _degreeName,
        string memory _major,
        string memory _ipfsHash
    ) internal {
        diplomas[_diplomaId].diplomaId = _diplomaId;
        diplomas[_diplomaId].studentId = _studentId;
        diplomas[_diplomaId].universityName = _universityName;
        diplomas[_diplomaId].degreeName = _degreeName;
        diplomas[_diplomaId].major = _major;
        diplomas[_diplomaId].ipfsHash = _ipfsHash;
        diplomas[_diplomaId].studentAddress = msg.sender;
        diplomas[_diplomaId].issueDate = block.timestamp;
        diplomas[_diplomaId].isVerified = false;
    }

    // Helper function to set encrypted diploma data
    function _setDiplomaEncryptedData(
        uint256 _diplomaId,
        euint32 _encryptedGpa,
        euint32 _encryptedGraduationYear,
        euint8 _encryptedDegreeType
    ) internal {
        diplomas[_diplomaId].encryptedGpa = _encryptedGpa;
        diplomas[_diplomaId].encryptedGraduationYear = _encryptedGraduationYear;
        diplomas[_diplomaId].encryptedDegreeType = _encryptedDegreeType;
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

    // FHE encrypted data getters (students can decrypt their own data)
    function getDiplomaEncryptedData(uint256 _diplomaId) public view returns (
        euint32 encryptedGpa,
        euint32 encryptedGraduationYear,
        euint8 encryptedDegreeType
    ) {
        require(_diplomaId < diplomaCounter, "Diploma does not exist");
        Diploma memory diploma = diplomas[_diplomaId];
        
        return (
            diploma.encryptedGpa,
            diploma.encryptedGraduationYear,
            diploma.encryptedDegreeType
        );
    }
}