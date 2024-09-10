package com.example.pfe.service;

import com.example.pfe.entity.AgentCtrl;
import com.example.pfe.repository.AgentCtrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AgentCtrlService {

    @Autowired
    private AgentCtrlRepository agentCtrlRepository;

    public Optional<AgentCtrl> findByNom(String nom) {
        return agentCtrlRepository.findByNom(nom);
    }

    public AgentCtrl createAgent(AgentCtrl agentCtrl) {
        return agentCtrlRepository.save(agentCtrl);
    }

    public void deleteAgent(Long idAg) {
        agentCtrlRepository.deleteById(idAg);
    }
}
