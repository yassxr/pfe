package com.example.pfe.service;

import com.example.pfe.entity.EEP;
import com.example.pfe.repository.EEPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EEPService {

    @Autowired
    private EEPRepository eepRepository;

    public Optional<EEP> findBySigle(String sigle) {
        return eepRepository.findBySigle(sigle);
    }

    public EEP createEEP(EEP eep) {
        return eepRepository.save(eep);
    }

    public void deleteEEP(Long idEep) {
        eepRepository.deleteById(idEep);
    }

    public List<EEP> getAllEEPs() {
        return eepRepository.findAll();
    }
}
