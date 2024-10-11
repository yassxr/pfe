package com.example.pfe.service;


import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.pfe.dto.LoginUserDto;
import com.example.pfe.dto.RegisterUserDto;
import com.example.pfe.entity.Agent;
import com.example.pfe.entity.EEP;
import com.example.pfe.entity.Role;
import com.example.pfe.entity.RoleName;
import com.example.pfe.entity.User;
import com.example.pfe.repository.RoleRepository;
import com.example.pfe.repository.UserRepository;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;
    
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
        UserRepository userRepository,
        RoleRepository roleRepository,
        AuthenticationManager authenticationManager,
        PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String signup(RegisterUserDto registerUserDto) {


    // Trouver le rôle associé (AGENT ou EEP)
    RoleName roleName = registerUserDto.getRoleName();
    Optional<Role> roleOptional = roleRepository.findByName(roleName);
    if (!roleOptional.isPresent()) {
        throw new RuntimeException("Role not found.");
    }

    User user;

    // Créer un utilisateur spécifique en fonction du rôle
    if (roleName == RoleName.AGENT) {
        Agent agent = new Agent();
        agent.setName(registerUserDto.getName());
        agent.setEmail(registerUserDto.getEmail());
        agent.setPassword(passwordEncoder.encode(registerUserDto.getPassword()));
        agent.setPosition(registerUserDto.getPosition()); // Champ spécifique à Agent
        agent.setRoles(Collections.singletonList(roleOptional.get()));
        user = agent;
    } else if (roleName == RoleName.EEP) {
        EEP eep = new EEP();
        eep.setName(registerUserDto.getName());
        eep.setEmail(registerUserDto.getEmail());
        eep.setPassword(passwordEncoder.encode(registerUserDto.getPassword()));
        eep.setSigle(registerUserDto.getSigle()); // Champ spécifique à EEP
        eep.setRaison(registerUserDto.getRaison()); // Champ spécifique à EEP
        eep.setCreationDate(LocalDate.now()); // Automatically set creation date
        eep.setEndDate(null); // Initially null
        eep.setRoles(Collections.singletonList(roleOptional.get()));
        user = eep;
    } else {
        throw new RuntimeException("Invalid role specified.");
    }

    // Sauvegarder l'utilisateur dans la base de données
    userRepository.save(user);
    return "User registered successfully";
}

    
    

    public User authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(input.getEmail())
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

// Check if the user is an EEP and verify their endDate
if (user instanceof EEP) {
    EEP eepUser = (EEP) user;
    if (eepUser.getEndDate() != null && eepUser.getEndDate().isBefore(LocalDate.now())) {
        throw new UsernameNotFoundException("Account expired");
    }
}

return user;
}

}
