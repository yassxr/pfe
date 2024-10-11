package com.example.pfe.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.pfe.dto.ChangePasswordDto;
import com.example.pfe.entity.EEP;
import com.example.pfe.entity.Role;
import com.example.pfe.entity.RoleName;
import com.example.pfe.entity.User;
import com.example.pfe.repository.EEPRepository;
import com.example.pfe.repository.RoleRepository;
import com.example.pfe.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EEPRepository eepRepository;

    // Constructor-based dependency injection for userRepository
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findByEmail(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        return optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // Fetch all users
    public List<User> allUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }

    public EEP createEepUser(String name, String email, String sigle, String raison) {
        // Generate a random password
        String generatedPassword = generateRandomPassword();

        // Create an EEP user
        EEP eepUser = new EEP();
        eepUser.setName(name);
        eepUser.setEmail(email);
        eepUser.setPassword(passwordEncoder.encode(generatedPassword));
        eepUser.setSigle(sigle);
        eepUser.setRaison(raison);
        eepUser.setCreationDate(LocalDate.now());
        eepUser.setEndDate(null); // Initially null
        // Automatically set creation date


        // Assign the EEP role to the user
        Role eepRole = roleRepository.findByName(RoleName.EEP)
            .orElseThrow(() -> new RuntimeException("Role not found"));
        eepUser.setRoles(Collections.singletonList(eepRole));

        // Save the user
        EEP savedEepUser = userRepository.save(eepUser); // Save to the repository

        // Send the email with the password
        emailService.sendEmail(email, "Votre mot de passe", "Votre mot de passe est : " + generatedPassword);

        return savedEepUser; // Ensure it returns the saved EEP
    }

    // Method to generate a random password
    private String generateRandomPassword() {
        int length = 10;
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < length; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }

    public List<EEP> getActiveEepUsers() {
        LocalDate currentDate = LocalDate.now(); // Use LocalDate.now() to get today's date
        return eepRepository.findAllActiveEeps(currentDate);
    }

    // Delete EEP user by email
    public void deleteEepUser(String email) {
        EEP eepUser = eepRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("EEP user not found"));
        eepRepository.delete(eepUser);
    }

    public EEP updateEepUser(String email, EEP updatedEepDetails) {
        // Find the existing EEP user
        EEP existingEep = eepRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("EEP user not found"));
    
        // Update fields
        existingEep.setName(updatedEepDetails.getName());
        existingEep.setSigle(updatedEepDetails.getSigle());
        existingEep.setRaison(updatedEepDetails.getRaison());
        existingEep.setEndDate(updatedEepDetails.getEndDate());
    
        // Save the updated EEP user
        return eepRepository.save(existingEep);
    }

    public EEP findEepByEmail(String email) {
        Optional<EEP> optionalEep = eepRepository.findByEmail(email);
        return optionalEep.orElseThrow(() -> new RuntimeException("EEP not found"));
    }
    
    public List<EEP> getExpiredEepUsers() {
        LocalDate today = LocalDate.now();
        return eepRepository.findByEndDateBefore(today);
    }

    public List<String> getAllUserEmails() {
        return userRepository.findAll().stream()
            .map(user -> user.getEmail()) // Return just the email
            .collect(Collectors.toList());
    }

    public List<User> getAllUsers() {
        return userRepository.findAll(); // You can use this if needed
    }

    
    public boolean changePassword(Integer userId, ChangePasswordDto changePasswordDto) {
        // Find the user by userId
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found")); // Handle user not found

        // Check if the old password matches
        if (!passwordEncoder.matches(changePasswordDto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // Set the new password
        user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));

        // Save the updated user
        userRepository.save(user);
        return true; // Password changed successfully
    }
}