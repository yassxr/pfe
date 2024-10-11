package com.example.pfe.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.pfe.entity.EEP;

@Repository
public interface EEPRepository extends JpaRepository<EEP, Integer> {
    @Query("SELECT e FROM EEP e WHERE e.endDate IS NULL OR e.endDate > :currentDate")
    List<EEP> findAllActiveEeps(@Param("currentDate") LocalDate currentDate);
    Optional<EEP> findByEmail(String email); 
    List<EEP> findByEndDateBefore(LocalDate today);

}