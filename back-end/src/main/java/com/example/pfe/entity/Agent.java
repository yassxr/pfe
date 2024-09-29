package com.example.pfe.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "agent")
public class Agent extends User {
    
    private String position; 

}