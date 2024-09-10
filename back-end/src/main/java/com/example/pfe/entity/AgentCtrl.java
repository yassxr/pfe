package com.example.pfe.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "agent_ctrl")
public class AgentCtrl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ag")
    private Long idAg;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "division")
    private String division;

    @Column(name = "service")
    private String service;

    // Getters and setters
    public Long getIdAg() {
        return idAg;
    }

    public void setIdAg(Long idAg) {
        this.idAg = idAg;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }
}
