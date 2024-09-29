package com.example.pfe.entity;

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
    private LocalDateTime validationDate;
    private String filePath; 


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
}

