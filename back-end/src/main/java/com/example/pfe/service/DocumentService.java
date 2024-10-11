package com.example.pfe.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.pfe.dto.DocumentDto; // Import the DocumentDto
import com.example.pfe.entity.User;
import com.example.pfe.entity.Document;
import com.example.pfe.repository.DocumentRepository;
import com.example.pfe.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    
    public DocumentDto saveDocument(MultipartFile file, String email) {
        // Define a directory where you want to save files, e.g., "uploads"
        String uploadDir = "uploads/";
    
        // Create the directory if it doesn't exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs(); // Create the directory and any parent directories if they don't exist
        }
    
        // Get the original filename and append a timestamp or unique identifier to ensure uniqueness
        String originalFilename = file.getOriginalFilename();
        String uniqueFilename = System.currentTimeMillis() + "_" + originalFilename; // Ensure uniqueness
        String filePath = uploadDir + uniqueFilename; // Full path to save the file
    
        try {
            // Save the file to the specified path
            Path path = Paths.get(filePath);
            Files.write(path, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Could not save the file: " + e.getMessage());
        }
    
        // Now you can save the document in the database, with filePath being the path to the file
        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user = optionalUser.orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    
        Document document = new Document();
        document.setFileName(originalFilename); // Store the original filename
        document.setUploadDate(LocalDateTime.now());
        document.setStatus("En attente");
        document.setFilePath(filePath); // Store the full file path in the database
        document.setUser(user); // Set the user who uploaded the document
    
        Document savedDocument = documentRepository.save(document);
    
        // Convert to DTO before returning
        return convertToDto(savedDocument);
    }
    
    
    public List<DocumentDto> getAllDocuments() {
        return documentRepository.findAll().stream()
                .map(this::convertToDto) // Assuming you have a method to convert Document to DocumentDto
                .collect(Collectors.toList());
    }

    public List<DocumentDto> findDocumentsByUserId(Integer userId) {
        List<Document> documents = documentRepository.findByUserId(userId);
        // Convert List<Document> to List<DocumentDto>
        return documents.stream()
                .map(this::convertToDto) // Convert each Document to DocumentDto
                .collect(Collectors.toList());
    }
    
    public List<Document> findAll() {
        return documentRepository.findAll(); // Fetch all documents from the repository
    }
public Document updateStatus(Long id, String newStatus, String agentEmail) {
    Optional<Document> optionalDocument = documentRepository.findById(id);

    if (!optionalDocument.isPresent()) {
        throw new NoSuchElementException("Document not found with ID: " + id);
    }

    Document document = optionalDocument.get();
    document.setStatus(newStatus);

    // Set the email of the agent who processed the document
    document.setProcessedBy(agentEmail);

    if ("Validé".equals(newStatus)) {
        document.setValidationDate(LocalDateTime.now()); // Set validation date if status is "Validé"
    }

    // Log the updated document before saving
    System.out.println("Updating Document: " + document);

    return documentRepository.save(document); // Save the updated document
}


    public void invalidateDocument(Long documentId, String rejectionReason, String agentEmail) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

        document.setStatus("Non validé");
        document.setProcessedBy(agentEmail); // Ensure processedBy is set
        document.setRejectionReason(rejectionReason);
        document.setNonValidationDate(LocalDateTime.now()); // Set the current date for non-validation
        documentRepository.save(document);
    }
    
    

        private DocumentDto convertToDto(Document document) {
            String submittedBy = document.getUser() != null ? document.getUser().getEmail() : null; // Fetch user email
            return new DocumentDto(
                document.getId(),
                document.getFileName(),
                document.getUploadDate(),
                document.getValidationDate(),
                document.getStatus(),
                submittedBy,
                document.getNonValidationDate(),
                document.getRejectionReason(),
                document.getProcessedBy(),
                document.getUser() != null ? document.getUser().getId() : null // Handle potential null user
        );
    }
    

    public List<DocumentDto> getValidatedDocuments() {
        List<Document> validatedDocuments = documentRepository.findByStatus("Validé");
        System.out.println("Called getValidatedDocuments");
        System.out.println("Validated Documents: " + validatedDocuments); // Log the retrieved documents
        return validatedDocuments.stream()
                                 .map(this::convertToDto)
                                 .collect(Collectors.toList());
    }
    
    public List<DocumentDto> getNonValidatedDocuments() {
        List<Document> nonValidatedDocuments = documentRepository.findByStatus("Non validé");
        System.out.println("Called getNonValidatedDocuments");
        System.out.println("Non-Validated Documents: " + nonValidatedDocuments); // Log the retrieved documents
        return nonValidatedDocuments.stream()
                                    .map(this::convertToDto)
                                    .collect(Collectors.toList());
    }

    public void deleteDocument(Long id) {
        Optional<Document> optionalDocument = documentRepository.findById(id);
        if (optionalDocument.isPresent()) {
            Document document = optionalDocument.get();

            // Delete the file from the filesystem
            try {
                Files.deleteIfExists(Paths.get(document.getFilePath())); // Ensure the file path is valid
            } catch (IOException e) {
                throw new RuntimeException("Could not delete the file: " + e.getMessage());
            }

            // Now delete the document from the database
            documentRepository.delete(document);
        } else {
            throw new RuntimeException("Document not found with ID: " + id);
        }
    }

    public List<DocumentDto> getAllPendingDocuments() {
        List<Document> documents = documentRepository.findByStatus("En attente");
        System.out.println("Called getNonValidatedDocuments");
        System.out.println("Pending Documents: " + documents); // Log the retrieved documents
        return documents.stream()
                                    .map(this::convertToDto)
                                    .collect(Collectors.toList());
    }

    public List<DocumentDto> getPendingDocumentsByUserId(Integer userId) {
        List<Document> documents = documentRepository.findByUserIdAndStatus(userId, "En attente");
        return documents.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<DocumentDto> getValidatedDocumentsByUserId(Integer userId) {
        List<Document> documents = documentRepository.findByUserIdAndStatus(userId, "Validé");
        return documents.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<DocumentDto> getNonValidatedDocumentsByUserId(Integer userId) {
        List<Document> documents = documentRepository.findByUserIdAndStatus(userId, "Non validé");
        return documents.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<DocumentDto> getUserDocuments(Integer userId) {
        List<Document> documents = documentRepository.findByUserId(userId);
        // Convert List<Document> to List<DocumentDto>
        return documents.stream()
            .map(this::convertToDto) // Use a method reference or a lambda expression
            .collect(Collectors.toList());
    }
    
}
