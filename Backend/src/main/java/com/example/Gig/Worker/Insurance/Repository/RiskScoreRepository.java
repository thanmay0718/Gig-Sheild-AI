package com.example.Gig.Worker.Insurance.Repository;

import com.example.Gig.Worker.Insurance.Model.RiskScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiskScoreRepository extends JpaRepository<RiskScore, Long> {

    // Used by RiskController
    List<RiskScore> findByWorkerId(Long workerId);

    // Used by RiskController - latest score per worker
    Optional<RiskScore> findTopByWorkerIdOrderByCalculatedAtDesc(Long workerId);

    // Used by AdminController analytics
    long countByRiskLevel(String riskLevel);

    // Used by admin — all workers at a given risk level
    List<RiskScore> findByRiskLevel(String riskLevel);

    int countByWorkerIdAndRiskLevel(Long workerId, String high);
}