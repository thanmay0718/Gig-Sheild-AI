package com.example.Gig.Worker.Insurance.Service;

import com.example.Gig.Worker.Insurance.DTO.ClaimRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.ClaimResponseDTO;
import com.example.Gig.Worker.Insurance.Fraud.FraudDetectionService;
import com.example.Gig.Worker.Insurance.Model.Claim;
import com.example.Gig.Worker.Insurance.Repository.ClaimRepository;
import com.example.Gig.Worker.Insurance.mapper.ClaimMapper;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final FraudDetectionService fraudService;

    public ClaimService(ClaimRepository claimRepository,
                        FraudDetectionService fraudService) {
        this.claimRepository = claimRepository;
        this.fraudService = fraudService;
    }

    // ── Create claim ──────────────────────────────────────────────────────────
    public ClaimResponseDTO createClaim(ClaimRequestDTO request) {

        // ── FIXED: accept title OR description from frontend ──────────────────
        String effectiveDescription = request.getEffectiveDescription();
        if (effectiveDescription == null) {
            throw new RuntimeException("Please describe your claim (description required)");
        }
        if (request.getAmount() <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }

        // Normalize — always store in description field
        request.setDescription(effectiveDescription);

        Claim claim = ClaimMapper.toEntity(request);
        claim.setStatus("PENDING");
        claim.setClaimDate(LocalDateTime.now());
        claim.setCreatedAt(LocalDateTime.now());

        // ── Fraud check — skip if workerId is null (new user / demo) ─────────
        boolean fraud = false;
        if (request.getWorkerId() != null) {
            try {
                fraud = fraudService.isDuplicateClaim(claim);
            } catch (Exception e) {
                // Never let fraud check crash a valid claim submission
                fraud = false;
            }
        }
        claim.setFraudFlag(fraud);

        // Parametric: auto-approve if clean
        claim.setStatus(fraud ? "PENDING" : "APPROVED");

        Claim saved = claimRepository.save(claim);
        return ClaimMapper.toResponseDTO(saved);
    }

    // ── Get all claims (admin) ────────────────────────────────────────────────
    public List<ClaimResponseDTO> getAllClaims() {
        return claimRepository.findAll()
                .stream()
                .map(ClaimMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ── Get by workerId (worker dashboard) ────────────────────────────────────
    public List<ClaimResponseDTO> getClaimsByWorkerId(Long workerId) {
        return claimRepository.findByWorkerId(workerId)
                .stream()
                .map(ClaimMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ── Get single claim ──────────────────────────────────────────────────────
    public ClaimResponseDTO getClaimById(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found: " + id));
        return ClaimMapper.toResponseDTO(claim);
    }

    // ── Admin: update claim status ────────────────────────────────────────────
    public ClaimResponseDTO updateClaimStatus(Long id, String status) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found: " + id));
        claim.setStatus(status.toUpperCase());
        claim.setCreatedAt(LocalDateTime.now());
        return ClaimMapper.toResponseDTO(claimRepository.save(claim));
    }
}