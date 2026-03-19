package com.example.Gig.Worker.Insurance.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class WorkerResponseDTO {

    private Long id;             // DB primary key — used as workerId in frontend
    private String workerId;     // readable ID e.g. "GIG-001"
    private String name;
    private String email;        // from linked User
    private String city;
    private String platform;
    private Long phoneNumber;
    private Double avgIncome;
    private Double riskScore;
    private String role;         // "WORKER" or "ADMIN" — from linked User
    private LocalDateTime createdAt;

    public WorkerResponseDTO() {}
}