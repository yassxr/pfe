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

    // Constructor with all fields
    public DocumentDto(Long id, String fileName, LocalDateTime uploadDate, LocalDateTime validationDate, String status, String submittedBy) {
        this.id = id;
        this.fileName = fileName;
        this.uploadDate = uploadDate;
        this.validationDate = validationDate; // Initialize validation date
        this.status = status;
        this.submittedBy = submittedBy;
    }
}
