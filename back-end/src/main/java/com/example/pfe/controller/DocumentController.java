package com.example.pfe.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;

import com.example.pfe.dto.DocumentDto;
import com.example.pfe.entity.Document;
import com.example.pfe.entity.User;
import com.example.pfe.repository.DocumentRepository;
import com.example.pfe.repository.UserRepository;
import com.example.pfe.service.DocumentService;

import jakarta.persistence.EntityNotFoundException;

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

    
@PutMapping("/{id}/status")
public ResponseEntity<Document> updateDocumentStatus(
        @PathVariable Long id, 
        @RequestBody Map<String, String> statusMap, 
        Authentication authentication) {

    String status = statusMap.get("status"); // Get status from the request body
    String agentEmail = authentication.getName(); // Get the email of the authenticated agent

    if (status == null || status.isEmpty()) {
        return ResponseEntity.badRequest().body(null); // Bad Request if status is missing
    }

    try {
        Document updatedDocument = documentService.updateStatus(id, status, agentEmail);
        return ResponseEntity.ok(updatedDocument);
    } catch (NoSuchElementException e) {
        // Handle case where document is not found
        return ResponseEntity.notFound().build();
    } catch (Exception e) {
        // Log other exceptions
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}


    @GetMapping("/all/validated")
    public List<DocumentDto> getValidatedDocuments() {
        List<DocumentDto> documents = documentService.getValidatedDocuments();
        System.out.println("Returning validated documents: " + documents); // Log the result
        return documents;
    }
    
    @GetMapping("/all/non-validated")
    public ResponseEntity<List<DocumentDto>> getNonValidatedDocuments() {
        List<DocumentDto> nonValidatedDocuments = documentService.getNonValidatedDocuments();
        return ResponseEntity.ok(nonValidatedDocuments);
    }

        @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build(); // Return a 204 No Content response
    }

    @PutMapping("/{id}/invalidate")
    public ResponseEntity<Void> invalidateDocument(
            @PathVariable Long id, 
            @RequestBody Map<String, String> requestBody, 
            Authentication authentication) {
        String rejectionReason = requestBody.get("rejectionReason");
        String agentEmail = authentication.getName(); // Get authenticated user's email

        try {
            documentService.invalidateDocument(id, rejectionReason, agentEmail);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{userId}/pending")
    public ResponseEntity<List<DocumentDto>> getPendingDocumentsByUserId(@PathVariable Integer userId) {
        List<DocumentDto> documents = documentService.getPendingDocumentsByUserId(userId);
        return ResponseEntity.ok(documents);
    }

    // Endpoint to get all pending documents
    @GetMapping("/all/pending")
    public ResponseEntity<List<DocumentDto>> getAllPendingDocuments() {
        List<DocumentDto> documents = documentService.getAllPendingDocuments();
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{userId}/validated")
    public ResponseEntity<List<DocumentDto>> getValidatedDocumentsByUserId(@PathVariable Integer userId) {
        List<DocumentDto> documents = documentService.getValidatedDocumentsByUserId(userId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{userId}/non-validated")
    public ResponseEntity<List<DocumentDto>> getNonValidatedDocumentsByUserId(@PathVariable Integer userId) {
        List<DocumentDto> documents = documentService.getNonValidatedDocumentsByUserId(userId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DocumentDto>> getDocumentsByUserId(@PathVariable Integer userId) {
        List<DocumentDto> documents = documentService.findDocumentsByUserId(userId);
        return ResponseEntity.ok(documents);
    }
    
}