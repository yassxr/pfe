package com.example.pfe.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.pfe.dto.EepRequest;
import com.example.pfe.entity.EEP;
import com.example.pfe.entity.User;
import com.example.pfe.service.UserService;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> allUsers() {
        List<User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }
    
    @PostMapping("/create-eep")
    public ResponseEntity<EEP> createEepUser(@RequestBody EepRequest eepRequest) {
    System.out.println("Received request to create EEP user: " + eepRequest);
    EEP eepUser = userService.createEepUser(eepRequest.getName(), eepRequest.getEmail(), eepRequest.getSigle(), eepRequest.getRaison());
    System.out.println("Created EEP user: " + eepUser);
    return ResponseEntity.status(HttpStatus.CREATED).body(eepUser);
}

    @GetMapping("/active-eep")
    public ResponseEntity<List<EEP>> getActiveEepUsers() {
        List<EEP> activeEeps = userService.getActiveEepUsers(); // Ensure this method exists in UserService
        return ResponseEntity.ok(activeEeps);
    }

    @DeleteMapping("/delete-eep/{email}")
    public ResponseEntity<String> deleteEepUser(@PathVariable String email) {
        userService.deleteEepUser(email); // Ensure this method exists in UserService
        return ResponseEntity.ok("EEP user deleted successfully");
    }

    // Endpoint to get EEP details by email
    @GetMapping("/get-eep/{email}")
    public ResponseEntity<EEP> getEepByEmail(@PathVariable String email) {
        EEP eepUser = userService.findEepByEmail(email);
        return ResponseEntity.ok(eepUser);
    }
    

    // Endpoint to update an EEP
    @PutMapping("/update-eep/{email}")
    public ResponseEntity<EEP> updateEep(@PathVariable String email, @RequestBody EEP updatedEepDetails) {
        EEP updatedEep = userService.updateEepUser(email, updatedEepDetails);
        return ResponseEntity.ok(updatedEep);
    }

    @GetMapping("/old-users")
    public List<EEP> getExpiredEepUsers() {
        return userService.getExpiredEepUsers();
    }
    
}
