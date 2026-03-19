package com.example.Gig.Worker.Insurance.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PolicyRequestDTO {
    private Long workerId;
    private String policyType;      // "BASIC", "STANDARD", "PREMIUM"
    private Double premium;         // weekly premium in ₹
    private Double weeklyPremium;   // alias — frontend may send either
    private Double coverageAmount;  // max payout per week
    private LocalDate startDate;
    private LocalDate endDate;
}