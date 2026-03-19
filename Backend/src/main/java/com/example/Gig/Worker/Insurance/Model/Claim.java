package com.example.Gig.Worker.Insurance.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long workerId;

    private Long policyId;

    private String description;

    private double amount;

    private String status;          // "PENDING", "APPROVED", "REJECTED"

    private String location;

    private Boolean fraudFlag;

    private LocalDateTime claimDate;

    // Parametric trigger type — "WEATHER","FLOOD","RAIN","CURFEW","STRIKE" etc.
    private String disruptionType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.claimDate == null) {
            this.claimDate = LocalDateTime.now();
        }
        this.createdAt = LocalDateTime.now();
    }
}