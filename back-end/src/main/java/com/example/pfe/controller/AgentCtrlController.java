package com.example.pfe.controller;

import com.example.pfe.entity.AgentCtrl;
import com.example.pfe.service.AgentCtrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/agent")
public class AgentCtrlController {

    @Autowired
    private AgentCtrlService agentCtrlService;

    @GetMapping("/nom/{nom}")
    public ResponseEntity<AgentCtrl> findByNom(@PathVariable String nom) {
        Optional<AgentCtrl> agent = agentCtrlService.findByNom(nom);
        return agent.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public AgentCtrl createAgent(@RequestBody AgentCtrl agentCtrl) {
        return agentCtrlService.createAgent(agentCtrl);
    }

    @DeleteMapping("/{idAg}")
    public ResponseEntity<Void> deleteAgent(@PathVariable Long idAg) {
        agentCtrlService.deleteAgent(idAg);
        return ResponseEntity.noContent().build();
    }
}
