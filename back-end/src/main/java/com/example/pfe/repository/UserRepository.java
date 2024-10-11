package com.example.pfe.repository;

import com.example.pfe.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email); // Change this to return Optional<User>
    List<User> findAll(); // This is usually included by default

}

