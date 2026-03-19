package com.example.Gig.Worker.Insurance.Repository;

import com.example.Gig.Worker.Insurance.Model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    // Used by ClaimService - worker dashboard
    List<Claim> findByWorkerId(Long workerId);

    // Used by FraudDetectionService - duplicate detection
    List<Claim> findByWorkerIdAndPolicyId(Long workerId, Long policyId);

    // Used by AdminClaims - filter by status
    List<Claim> findByStatus(String status);

    // Used by FraudAlerts admin screen
    List<Claim> findByFraudFlagTrue();

    // Used by Analytics - count by status
    long countByStatus(String status);
}