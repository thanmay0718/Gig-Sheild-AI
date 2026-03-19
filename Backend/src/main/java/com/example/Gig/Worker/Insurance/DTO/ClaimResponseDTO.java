package com.example.Gig.Worker.Insurance.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data  // generates proper getters, setters, equals, hashCode, toString
public class ClaimResponseDTO {

    private Long id;
    private Long workerId;
    private Long policyId;
    private String description;
    private double amount;
    private String location;
    private String status;        // "PENDING", "APPROVED", "REJECTED"
    private boolean fraudFlag;
    private LocalDateTime claimDate;
    private LocalDateTime updatedAt;

    public void setDisruptionType(String disruptionType) {

    }
}