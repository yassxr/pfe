package com.example.pfe.repository;

import com.example.pfe.entity.AgentCtrl;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AgentCtrlRepository extends JpaRepository<AgentCtrl, Long> {
    Optional<AgentCtrl> findByNom(String nom);
    AgentCtrl findByIdAg(Long id);

}
