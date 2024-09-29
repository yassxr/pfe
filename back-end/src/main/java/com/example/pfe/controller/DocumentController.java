package com.example.pfe.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.net.MalformedURLException;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;

import com.example.pfe.dto.DocumentDto;
import com.example.pfe.entity.Document;
import com.example.pfe.entity.User;
import com.example.pfe.repository.DocumentRepository;
import com.example.pfe.repository.UserRepository;
import com.example.pfe.service.DocumentService;
import java.nio.file.Path;


@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private DocumentService userService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(@RequestParam("file") MultipartFile file, Authentication authentication) {
    String email = authentication.getName(); // Get the email from the authentication object
    DocumentDto savedDoc = documentService.saveDocument(file, email); // Pass the email to the service
    return ResponseEntity.ok(savedDoc);}

    @Autowired
    private DocumentRepository documentRepository;

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
    Optional<Document> documentOptional = documentRepository.findById(id);

    if (!documentOptional.isPresent()) {
        return ResponseEntity.notFound().build();
    }
    Document document = documentOptional.get();
    String filePath = document.getFilePath(); // Replace with actual logic to get file path
    Path path = Paths.get(filePath);

    try {
        Resource resource = new UrlResource(path.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("Could not read the file!");
        }

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM) // You can adjust the content type if necessary
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
            .body(resource);

    } catch (MalformedURLException e) {
        throw new RuntimeException("Error: " + e.getMessage());
    }}

    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/user/{userId}/documents")
    public ResponseEntity<List<Document>> getDocumentsByUserId(@PathVariable Integer userId) {
    System.out.println("Fetching documents for user ID: " + userId);
    
    List<Document> documents = documentService.findDocumentsByUserId(userId);
    System.out.println("Documents found: " + documents.size());
    
    return ResponseEntity.ok(documents);}

    @GetMapping("/all")
    public ResponseEntity<List<DocumentDto>> getAllDocuments() {
        List<DocumentDto> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Document> updateDocumentStatus(@PathVariable Long id, @RequestBody String status) {
        try {
            Document updatedDocument = documentService.updateStatus(id, status);
            return ResponseEntity.ok(updatedDocument);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/validated")
    public List<DocumentDto> getValidatedDocuments() {
        List<DocumentDto> documents = documentService.getValidatedDocuments();
        System.out.println("Returning validated documents: " + documents); // Log the result
        return documents;
    }
    
    @GetMapping("/non-validated")
    public List<DocumentDto> getNonValidatedDocuments() {
        List<DocumentDto> documents = documentService.getNonValidatedDocuments();
        System.out.println("Returning non-validated documents: " + documents); // Log the result
        return documents;
    }

        @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build(); // Return a 204 No Content response
    }

    }

