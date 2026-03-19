package com.example.Gig.Worker.Insurance.Service;

import com.example.Gig.Worker.Insurance.DTO.PolicyRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.PolicyResponseDTO;
import com.example.Gig.Worker.Insurance.Model.Policy;
import com.example.Gig.Worker.Insurance.Repository.PolicyRepository;
import com.example.Gig.Worker.Insurance.exception.ResourceNotFoundException;
import com.example.Gig.Worker.Insurance.mapper.PolicyMapper;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepository;

    public PolicyServiceImpl(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    @Override
    public PolicyResponseDTO createPolicy(PolicyRequestDTO requestDTO) {
        Policy policy = PolicyMapper.toEntity(requestDTO);
        policy.setStatus("ACTIVE");
        Policy savedPolicy = policyRepository.save(policy);
        return PolicyMapper.toResponseDTO(savedPolicy);
    }

    @Override
    public List<PolicyResponseDTO> getPoliciesByWorker(Long workerId) {
        // ── FIXED: return empty list instead of throwing ──────────────────
        // Frontend handles empty array gracefully — exception breaks the UI
        return policyRepository.findByWorkerId(workerId)
                .stream()
                .map(PolicyMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ── Get ALL policies (admin dashboard) ───────────────────────────────────
    public List<PolicyResponseDTO> getAllPolicies() {
        return policyRepository.findAll()
                .stream()
                .map(PolicyMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ── Cancel/expire a policy (admin action) ────────────────────────────────
    public PolicyResponseDTO updatePolicyStatus(Long id, String status) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Policy not found with id: " + id));
        policy.setStatus(status.toUpperCase()); // "ACTIVE","EXPIRED","CANCELLED"
        return PolicyMapper.toResponseDTO(policyRepository.save(policy));
    }
}