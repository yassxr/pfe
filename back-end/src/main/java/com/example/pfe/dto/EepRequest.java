package com.example.pfe.dto;

public class EepRequest {
    private String name;      // Name of the EEP user
    private String email;     // Email of the EEP user
    private String sigle;     // Sigle of the EEP
    private String raison;    // Raison of the EEP

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSigle() {
        return sigle;
    }

    public void setSigle(String sigle) {
        this.sigle = sigle;
    }

    public String getRaison() {
        return raison;
    }

    public void setRaison(String raison) {
        this.raison = raison;
    }
}
