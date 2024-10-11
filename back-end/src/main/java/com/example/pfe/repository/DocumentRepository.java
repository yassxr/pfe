package com.example.pfe.repository;

import com.example.pfe.dto.DocumentDto;
import com.example.pfe.entity.Document;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    List<Document> findByUserId(Integer userId);
    List<Document> findByStatus(String status);
    List<Document> findByUserIdAndStatus(Integer userId, String status);



}

