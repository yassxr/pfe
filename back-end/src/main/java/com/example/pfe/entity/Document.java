package com.example.pfe.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fileName;
    private LocalDateTime uploadDate;
    private String status;
    private String submittedBy; // Ensure this field exists
    private LocalDateTime validationDate;
    private LocalDateTime nonValidationDate; // Date de non-validation
    private String rejectionReason;
    private String processedBy; // Ensure this field exists
    private String filePath; // Use this for storing file path if needed

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
}

