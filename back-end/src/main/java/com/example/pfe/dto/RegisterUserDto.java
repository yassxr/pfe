package com.example.pfe.dto;

import com.example.pfe.entity.RoleName;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserDto {

    private String email;            // Email of the user
    private String password;         // Password for the user
    private String name;             // Name of the user
    private RoleName roleName;      // Role of the user (AGENT or EEP)
    private String position;         // Position for AGENT
    private String sigle;            // Sigle for EEP
    private String raison;           // Raison for EEP (if applicable)
    
    // Additional fields can be added as necessary
}
