package com.example.Gig.Worker.Insurance.Controller;

import com.example.Gig.Worker.Insurance.DTO.ClaimRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.ClaimResponseDTO;
import com.example.Gig.Worker.Insurance.Service.ClaimService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/claims")
@CrossOrigin(origins = {"http://localhost:9091", "http://localhost:5173", "http://localhost:3000"})
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    // POST /claims
    @PostMapping
    public ResponseEntity<ClaimResponseDTO> createClaim(@RequestBody ClaimRequestDTO request) {
        return ResponseEntity.ok(claimService.createClaim(request));
    }

    // GET /claims              → all claims (admin)
    // GET /claims?workerId=1   → filtered by worker (worker dashboard)
    @GetMapping
    public ResponseEntity<List<ClaimResponseDTO>> getClaims(
            @RequestParam(required = false) Long workerId) {
        if (workerId != null) {
            return ResponseEntity.ok(claimService.getClaimsByWorkerId(workerId));
        }
        return ResponseEntity.ok(claimService.getAllClaims());
    }

    // GET /claims/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ClaimResponseDTO> getClaimById(@PathVariable Long id) {
        return ResponseEntity.ok(claimService.getClaimById(id));
    }

    // PUT /claims/{id}/status  → admin approves/rejects
    @PutMapping("/{id}/status")
    public ResponseEntity<ClaimResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(claimService.updateClaimStatus(id, status));
    }
}