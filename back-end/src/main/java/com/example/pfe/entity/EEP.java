package com.example.pfe.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "eep")
public class EEP {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_eep")
    private Long idEep;

    @Column(name = "raison_sociale")
    private String raison;

    @Column(name = "sigle")
    private String sigle;

    // Getters and setters
    public Long getIdEep() {
        return idEep;
    }

    public void setIdEep(Long idEep) {
        this.idEep = idEep;
    }

    public String getRaison() {
        return raison;
    }

    public void setRaison(String raison) {
        this.raison = raison;
    }

    public String getSigle() {
        return sigle;
    }

    public void setSigle(String sigle) {
        this.sigle = sigle;
    }

}
