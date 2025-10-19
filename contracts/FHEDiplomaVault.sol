// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract FHEDiplomaVault is SepoliaConfig {
    using FHE for *;
    
    struct Diploma {
        euint32 diplomaId;
        euint32 studentId;
        euint32 graduationYear;
        euint32 gpa;
        euint8 degreeType; // 1=Bachelor, 2=Master, 3=PhD
        ebool isVerified;
        ebool isActive;
        string universityName;
        string degreeName;
        string major;
        address student;
        address university;
        uint256 issueDate;
        uint256 expiryDate;
        string ipfsHash;
    }
    
    struct Transcript {
        euint32 transcriptId;
        euint32 studentId;
        euint32 totalCredits;
        euint32 completedCredits;
        euint32 gpa;
        ebool isVerified;
        ebool isActive;
        string universityName;
        address student;
        address university;
        uint256 issueDate;
        string ipfsHash;
    }
    
    struct VerificationRequest {
        euint32 requestId;
        euint32 credentialId;
        ebool isDiploma; // true for diploma, false for transcript
        ebool isApproved;
        ebool isCompleted;
        address requester;
        address university;
        uint256 requestDate;
        uint256 responseDate;
        string purpose;
    }
    
    struct University {
        euint32 universityId;
        ebool isVerified;
        ebool isActive;
        string name;
        string country;
        string accreditation;
        address admin;
        uint256 registrationDate;
    }
    
    mapping(uint256 => Diploma) public diplomas;
    mapping(uint256 => Transcript) public transcripts;
    mapping(uint256 => VerificationRequest) public verificationRequests;
    mapping(address => University) public universities;
    mapping(address => euint32) public studentReputation;
    mapping(address => euint32) public universityReputation;
    
    uint256 public diplomaCounter;
    uint256 public transcriptCounter;
    uint256 public verificationCounter;
    uint256 public universityCounter;
    
    address public owner;
    address public verifier;
    
    event DiplomaIssued(uint256 indexed diplomaId, address indexed student, address indexed university);
    event TranscriptIssued(uint256 indexed transcriptId, address indexed student, address indexed university);
    event VerificationRequested(uint256 indexed requestId, address indexed requester, uint256 indexed credentialId);
    event VerificationCompleted(uint256 indexed requestId, bool isApproved);
    event UniversityRegistered(uint256 indexed universityId, address indexed admin, string name);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function registerUniversity(
        string memory _name,
        string memory _country,
        string memory _accreditation
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "University name cannot be empty");
        require(universities[msg.sender].admin == address(0), "University already registered");
        
        uint256 universityId = universityCounter++;
        
        universities[msg.sender] = University({
            universityId: FHE.asEuint32(0), // Will be set properly later
            isVerified: FHE.asEbool(false),
            isActive: FHE.asEbool(true),
            name: _name,
            country: _country,
            accreditation: _accreditation,
            admin: msg.sender,
            registrationDate: block.timestamp
        });
        
        emit UniversityRegistered(universityId, msg.sender, _name);
        return universityId;
    }
    
    function issueDiploma(
        address _student,
        string memory _degreeName,
        string memory _major,
        externalEuint32 _studentId,
        externalEuint32 _graduationYear,
        externalEuint32 _gpa,
        externalEuint8 _degreeType,
        uint256 _expiryDate,
        string memory _ipfsHash,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(universities[msg.sender].admin != address(0), "Only registered universities can issue diplomas");
        require(_student != address(0), "Invalid student address");
        require(_expiryDate > block.timestamp, "Expiry date must be in the future");
        
        uint256 diplomaId = diplomaCounter++;
        
        // Convert external encrypted values to internal encrypted values
        euint32 internalStudentId = FHE.fromExternal(_studentId, inputProof);
        euint32 internalGraduationYear = FHE.fromExternal(_graduationYear, inputProof);
        euint32 internalGpa = FHE.fromExternal(_gpa, inputProof);
        euint8 internalDegreeType = FHE.fromExternal(_degreeType, inputProof);
        
        diplomas[diplomaId] = Diploma({
            diplomaId: FHE.asEuint32(diplomaId),
            studentId: internalStudentId,
            graduationYear: internalGraduationYear,
            gpa: internalGpa,
            degreeType: internalDegreeType,
            isVerified: FHE.asEbool(true),
            isActive: FHE.asEbool(true),
            universityName: universities[msg.sender].name,
            degreeName: _degreeName,
            major: _major,
            student: _student,
            university: msg.sender,
            issueDate: block.timestamp,
            expiryDate: _expiryDate,
            ipfsHash: _ipfsHash
        });
        
        // Set ACL permissions for decryption
        FHE.allowThis(diplomas[diplomaId].studentId);
        FHE.allowThis(diplomas[diplomaId].graduationYear);
        FHE.allowThis(diplomas[diplomaId].gpa);
        FHE.allowThis(diplomas[diplomaId].degreeType);
        FHE.allowThis(diplomas[diplomaId].isVerified);
        FHE.allowThis(diplomas[diplomaId].isActive);
        
        // Allow student to decrypt their own data
        FHE.allow(diplomas[diplomaId].studentId, _student);
        FHE.allow(diplomas[diplomaId].graduationYear, _student);
        FHE.allow(diplomas[diplomaId].gpa, _student);
        FHE.allow(diplomas[diplomaId].degreeType, _student);
        FHE.allow(diplomas[diplomaId].isVerified, _student);
        FHE.allow(diplomas[diplomaId].isActive, _student);
        
        emit DiplomaIssued(diplomaId, _student, msg.sender);
        return diplomaId;
    }
    
    function issueTranscript(
        address _student,
        externalEuint32 _studentId,
        externalEuint32 _totalCredits,
        externalEuint32 _completedCredits,
        externalEuint32 _gpa,
        string memory _ipfsHash,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(universities[msg.sender].admin != address(0), "Only registered universities can issue transcripts");
        require(_student != address(0), "Invalid student address");
        
        uint256 transcriptId = transcriptCounter++;
        
        // Convert external encrypted values to internal encrypted values
        euint32 internalStudentId = FHE.fromExternal(_studentId, inputProof);
        euint32 internalTotalCredits = FHE.fromExternal(_totalCredits, inputProof);
        euint32 internalCompletedCredits = FHE.fromExternal(_completedCredits, inputProof);
        euint32 internalGpa = FHE.fromExternal(_gpa, inputProof);
        
        transcripts[transcriptId] = Transcript({
            transcriptId: FHE.asEuint32(0), // Will be set properly later
            studentId: internalStudentId,
            totalCredits: internalTotalCredits,
            completedCredits: internalCompletedCredits,
            gpa: internalGpa,
            isVerified: FHE.asEbool(true),
            isActive: FHE.asEbool(true),
            universityName: universities[msg.sender].name,
            student: _student,
            university: msg.sender,
            issueDate: block.timestamp,
            ipfsHash: _ipfsHash
        });
        
        emit TranscriptIssued(transcriptId, _student, msg.sender);
        return transcriptId;
    }
    
    function requestVerification(
        uint256 _credentialId,
        bool _isDiploma,
        string memory _purpose
    ) public returns (uint256) {
        require(_credentialId < diplomaCounter || _credentialId < transcriptCounter, "Credential does not exist");
        require(bytes(_purpose).length > 0, "Purpose cannot be empty");
        
        uint256 requestId = verificationCounter++;
        
        verificationRequests[requestId] = VerificationRequest({
            requestId: FHE.asEuint32(0), // Will be set properly later
            credentialId: FHE.asEuint32(_credentialId),
            isDiploma: FHE.asEbool(_isDiploma),
            isApproved: FHE.asEbool(false),
            isCompleted: FHE.asEbool(false),
            requester: msg.sender,
            university: _isDiploma ? diplomas[_credentialId].university : transcripts[_credentialId].university,
            requestDate: block.timestamp,
            responseDate: 0,
            purpose: _purpose
        });
        
        emit VerificationRequested(requestId, msg.sender, _credentialId);
        return requestId;
    }
    
    function respondToVerification(
        uint256 _requestId,
        externalEbool _isApproved,
        bytes calldata inputProof
    ) public {
        require(verificationRequests[_requestId].requester != address(0), "Request does not exist");
        require(verificationRequests[_requestId].university == msg.sender, "Only the issuing university can respond");
        require(!FHE.decrypt(verificationRequests[_requestId].isCompleted), "Request already completed");
        
        euint32 internalIsApproved = FHE.fromExternal(_isApproved, inputProof);
        
        verificationRequests[_requestId].isApproved = internalIsApproved;
        verificationRequests[_requestId].isCompleted = FHE.asEbool(true);
        verificationRequests[_requestId].responseDate = block.timestamp;
        
        emit VerificationCompleted(_requestId, FHE.decrypt(internalIsApproved));
    }
    
    function verifyUniversity(uint256 _universityId, bool _isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify universities");
        require(_universityId < universityCounter, "University does not exist");
        
        // Find the university by ID (this is a simplified approach)
        // In a real implementation, you'd need a mapping from ID to address
        universities[msg.sender].isVerified = FHE.asEbool(_isVerified);
    }
    
    function updateReputation(address user, externalEuint32 reputation, bytes calldata inputProof) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        euint32 internalReputation = FHE.fromExternal(reputation, inputProof);
        
        // Determine if user is student or university based on context
        if (universities[user].admin != address(0)) {
            universityReputation[user] = internalReputation;
        } else {
            studentReputation[user] = internalReputation;
        }
        
        emit ReputationUpdated(user, FHE.decrypt(internalReputation));
    }
    
    function getDiplomaInfo(uint256 diplomaId) public view returns (
        string memory universityName,
        string memory degreeName,
        string memory major,
        address student,
        address university,
        uint256 issueDate,
        uint256 expiryDate,
        string memory ipfsHash,
        bool isActive
    ) {
        Diploma storage diploma = diplomas[diplomaId];
        return (
            diploma.universityName,
            diploma.degreeName,
            diploma.major,
            diploma.student,
            diploma.university,
            diploma.issueDate,
            diploma.expiryDate,
            diploma.ipfsHash,
            FHE.decrypt(diploma.isActive)
        );
    }
    
    function getTranscriptInfo(uint256 transcriptId) public view returns (
        string memory universityName,
        address student,
        address university,
        uint256 issueDate,
        string memory ipfsHash,
        bool isActive
    ) {
        Transcript storage transcript = transcripts[transcriptId];
        return (
            transcript.universityName,
            transcript.student,
            transcript.university,
            transcript.issueDate,
            transcript.ipfsHash,
            FHE.decrypt(transcript.isActive)
        );
    }
    
    function getVerificationRequestInfo(uint256 requestId) public view returns (
        address requester,
        address university,
        uint256 requestDate,
        uint256 responseDate,
        string memory purpose,
        bool isCompleted
    ) {
        VerificationRequest storage request = verificationRequests[requestId];
        return (
            request.requester,
            request.university,
            request.requestDate,
            request.responseDate,
            request.purpose,
            FHE.decrypt(request.isCompleted)
        );
    }
    
    function getUniversityInfo(address universityAddress) public view returns (
        string memory name,
        string memory country,
        string memory accreditation,
        address admin,
        uint256 registrationDate,
        bool isVerified,
        bool isActive
    ) {
        University storage university = universities[universityAddress];
        return (
            university.name,
            university.country,
            university.accreditation,
            university.admin,
            university.registrationDate,
            FHE.decrypt(university.isVerified),
            FHE.decrypt(university.isActive)
        );
    }
    
    function getStudentReputation(address student) public view returns (uint32) {
        return FHE.decrypt(studentReputation[student]);
    }
    
    function getUniversityReputation(address university) public view returns (uint32) {
        return FHE.decrypt(universityReputation[university]);
    }
    
    function revokeCredential(uint256 credentialId, bool isDiploma) public {
        if (isDiploma) {
            require(diplomas[credentialId].university == msg.sender, "Only issuing university can revoke");
            diplomas[credentialId].isActive = FHE.asEbool(false);
        } else {
            require(transcripts[credentialId].university == msg.sender, "Only issuing university can revoke");
            transcripts[credentialId].isActive = FHE.asEbool(false);
        }
    }
    
    // Function to get encrypted diploma data for decryption
    function getDiplomaEncryptedData(uint256 diplomaId) public view returns (
        bytes32 studentId,
        bytes32 graduationYear,
        bytes32 gpa,
        bytes32 degreeType,
        bytes32 isVerified,
        bytes32 isActive
    ) {
        Diploma storage diploma = diplomas[diplomaId];
        return (
            FHE.toBytes32(diploma.studentId),
            FHE.toBytes32(diploma.graduationYear),
            FHE.toBytes32(diploma.gpa),
            FHE.toBytes32(diploma.degreeType),
            FHE.toBytes32(diploma.isVerified),
            FHE.toBytes32(diploma.isActive)
        );
    }
    
    // Function to get encrypted transcript data for decryption
    function getTranscriptEncryptedData(uint256 transcriptId) public view returns (
        bytes32 studentId,
        bytes32 totalCredits,
        bytes32 completedCredits,
        bytes32 gpa,
        bytes32 isVerified,
        bytes32 isActive
    ) {
        Transcript storage transcript = transcripts[transcriptId];
        return (
            FHE.toBytes32(transcript.studentId),
            FHE.toBytes32(transcript.totalCredits),
            FHE.toBytes32(transcript.completedCredits),
            FHE.toBytes32(transcript.gpa),
            FHE.toBytes32(transcript.isVerified),
            FHE.toBytes32(transcript.isActive)
        );
    }
    
    // Function to get encrypted verification request data for decryption
    function getVerificationRequestEncryptedData(uint256 requestId) public view returns (
        bytes32 requestIdEnc,
        bytes32 credentialId,
        bytes32 isDiploma,
        bytes32 isApproved,
        bytes32 isCompleted
    ) {
        VerificationRequest storage request = verificationRequests[requestId];
        return (
            FHE.toBytes32(request.requestId),
            FHE.toBytes32(request.credentialId),
            FHE.toBytes32(request.isDiploma),
            FHE.toBytes32(request.isApproved),
            FHE.toBytes32(request.isCompleted)
        );
    }
}
