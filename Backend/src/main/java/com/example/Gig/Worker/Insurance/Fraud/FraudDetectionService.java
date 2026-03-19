package com.example.Gig.Worker.Insurance.Fraud;

import com.example.Gig.Worker.Insurance.Model.Claim;
import com.example.Gig.Worker.Insurance.Repository.ClaimRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FraudDetectionService {

    private final ClaimRepository claimRepository;

    public FraudDetectionService(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    /**
     * Main fraud check — returns true if claim looks fraudulent
     * Checks:
     *   1. Duplicate amount within same worker + policy (original logic kept)
     *   2. Too many claims in last 7 days (abuse detection)
     *   3. Claim amount suspiciously high (> ₹5000 per single claim)
     */
    public boolean isDuplicateClaim(Claim newClaim) {

        List<Claim> previousClaims = claimRepository.findByWorkerIdAndPolicyId(
                newClaim.getWorkerId(),
                newClaim.getPolicyId()
        );

        // ── Check 1: Duplicate amount (original logic) ─────────────────────
        for (Claim claim : previousClaims) {
            if (Math.abs(claim.getAmount() - newClaim.getAmount()) < 500) {
                return true;  // flagged as duplicate
            }
        }

        // ── Check 2: Too many claims in last 7 days ────────────────────────
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        long recentClaimCount = previousClaims.stream()
                .filter(c -> c.getClaimDate() != null
                        && c.getClaimDate().isAfter(sevenDaysAgo))
                .count();

        if (recentClaimCount >= 3) {
            return true;  // more than 3 claims in a week is suspicious
        }

        // ── Check 3: Suspiciously high single claim amount ─────────────────
        if (newClaim.getAmount() > 5000) {
            return true;  // ₹5000+ single claim flagged for review
        }

        return false;
    }
}