package com.example.Gig.Worker.Insurance.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PolicyResponseDTO {
    private Long id;
    private Long workerId;
    private String policyType;      // "BASIC", "STANDARD", "PREMIUM"
    private Double premium;         // weekly premium ₹
    private Double weeklyPremium;   // same as premium — explicit label for frontend
    private Double coverageAmount;  // max payout per week ₹
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;          // "ACTIVE", "EXPIRED", "CANCELLED"
}