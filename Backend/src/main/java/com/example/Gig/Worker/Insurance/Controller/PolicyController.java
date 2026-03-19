package com.example.Gig.Worker.Insurance.Controller;

import com.example.Gig.Worker.Insurance.DTO.PolicyRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.PolicyResponseDTO;
import com.example.Gig.Worker.Insurance.Service.PolicyServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/policies")
@CrossOrigin(origins = {"http://localhost:9091", "http://localhost:5173", "http://localhost:3000"})
public class PolicyController {

    private final PolicyServiceImpl policyService;

    public PolicyController(PolicyServiceImpl policyService) {
        this.policyService = policyService;
    }

    // POST /policies — create new weekly policy
    @PostMapping
    public ResponseEntity<PolicyResponseDTO> createPolicy(
            @RequestBody PolicyRequestDTO request) {
        return ResponseEntity.ok(policyService.createPolicy(request));
    }

    // GET /policies — all policies (admin dashboard)
    @GetMapping
    public ResponseEntity<List<PolicyResponseDTO>> getAllPolicies() {
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    // GET /policies/worker/{workerId} — worker's own policies
    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<PolicyResponseDTO>> getPolicies(
            @PathVariable Long workerId) {
        return ResponseEntity.ok(policyService.getPoliciesByWorker(workerId));
    }

    // PUT /policies/{id}/status — admin cancels or expires a policy
    @PutMapping("/{id}/status")
    public ResponseEntity<PolicyResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {
        return ResponseEntity.ok(
                policyService.updatePolicyStatus(id, body.get("status")));
    }
}