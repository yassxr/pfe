package com.example.pfe.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "eep")
public class EEP extends User {
    
    private String raison;
    private LocalDate creationDate = LocalDate.now(); // Initialize to the current date
    private LocalDate endDate; // Can be null    private LocalDate endDate;
    private String sigle; 

}