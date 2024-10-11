package com.example.pfe.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor // No-args constructor for deserialization
public class DocumentDto {
    private Long id;
    private String fileName;
    private LocalDateTime uploadDate;
    private LocalDateTime validationDate;
    private String status;
    private String submittedBy;
    private LocalDateTime nonValidationDate; // Date de non-validation
    private String rejectionReason; // Motif de non-validation
    private String processedBy; // Email de l'agent ayant traité le document
    private Integer userId; // ID de l'utilisateur qui a soumis le document


    // Constructor with all fields
    public DocumentDto(Long id, String fileName, LocalDateTime uploadDate, LocalDateTime validationDate, String status, String submittedBy, 
                       LocalDateTime nonValidationDate, String rejectionReason, String processedBy, Integer userId) {
        this.id = id;
        this.fileName = fileName;
        this.uploadDate = uploadDate;
        this.validationDate = validationDate; // Initialize validation date
        this.status = status;
        this.submittedBy = submittedBy;
        this.nonValidationDate = nonValidationDate; // Initialize non-validation date
        this.rejectionReason = rejectionReason; // Initialize non-validation reason
        this.processedBy = processedBy; // Initialize the agent's email
        this.userId = userId; // Initialize the userId

    }
}
