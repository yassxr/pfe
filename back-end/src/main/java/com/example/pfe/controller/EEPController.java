package com.example.pfe.controller;

import com.example.pfe.entity.EEP;
import com.example.pfe.service.EEPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/eep")
public class EEPController {

    @Autowired
    private EEPService eepService;

    @GetMapping
    public ResponseEntity<List<EEP>> getAllEEPs() {
    List<EEP> eeps = eepService.getAllEEPs();
    return ResponseEntity.ok(eeps);
}

    @GetMapping("/sigle/{sigle}")
    public ResponseEntity<EEP> findBySigle(@PathVariable String sigle) {
        Optional<EEP> eep = eepService.findBySigle(sigle);
        return eep.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EEP> createEEP(@RequestBody EEP eep) {
        try {
            EEP createdEEP = eepService.createEEP(eep);
            return ResponseEntity.status(201).body(createdEEP);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{idEep}")
    public ResponseEntity<Void> deleteEEP(@PathVariable Long idEep) {
        try {
            eepService.deleteEEP(idEep);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}