package com.example.pfe.repository;

import com.example.pfe.entity.EEP;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface EEPRepository extends JpaRepository<EEP, Long> {
    Optional<EEP> findBySigle(String sigle);
}
