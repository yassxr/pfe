package com.example.pfe.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
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
        List<Document> documents = documentRepository.findAll();
        return documents.stream()
                        .map(this::convertToDto)
                        .collect(Collectors.toList());
    }

    public List<Document> findDocumentsByUserId(Integer userId) {
        return documentRepository.findByUserId(userId);
    }

    public List<Document> findAll() {
        return documentRepository.findAll(); // Fetch all documents from the repository
    }

    public Document updateStatus(Long id, String newStatus) {
        Optional<Document> optionalDocument = documentRepository.findById(id);

        if (optionalDocument.isPresent()) {
            Document document = optionalDocument.get();
            document.setStatus(newStatus);
                if ("Validé".equals(newStatus)) {
        document.setValidationDate(LocalDateTime.now());  // Set validation date if status is "Validé"
    } // Assuming there is a setStatus method in Document entity
            return documentRepository.save(document); // Save the updated document
        } else {
            throw new RuntimeException("Document not found with ID: " + id);
        }
    }

    private DocumentDto convertToDto(Document document) {
        String submittedBy = document.getUser() != null ? document.getUser().getEmail() : null; // Fetch user email
        return new DocumentDto(
            document.getId(), 
            document.getFileName(), 
            document.getUploadDate(), 
            document.getValidationDate(), // Add validation date here
            document.getStatus(), 
            submittedBy
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
    
    
}
