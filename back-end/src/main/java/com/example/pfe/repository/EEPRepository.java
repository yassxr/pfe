package com.example.pfe.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.pfe.entity.EEP;

@Repository
public interface EEPRepository extends JpaRepository<EEP, Integer> {
    List<EEP> findAllByEndDateIsNull(); // Fetch active EEPs
    Optional<EEP> findByEmail(String email); 
    List<EEP> findByEndDateBefore(LocalDate today);

}