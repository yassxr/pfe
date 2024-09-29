package com.example.pfe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.pfe.entity.Agent;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    // Méthodes spécifiques à Agent si nécessaire
}