package com.example.Gig.Worker.Insurance.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "policies")
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long workerId;

    private String policyType;      // "BASIC", "STANDARD", "PREMIUM"

    private Double premium;         // weekly premium in ₹

    private Double weeklyPremium;   // explicit weekly label (same value as premium)

    private Double coverageAmount;  // max payout per week in ₹

    private LocalDate startDate;

    private LocalDate endDate;

    private String status;          // "ACTIVE", "EXPIRED", "CANCELLED"

    @PrePersist
    protected void onCreate() {
        // Auto-set endDate to 7 days from start if not provided (weekly policy)
        if (this.startDate == null) {
            this.startDate = LocalDate.now();
        }
        if (this.endDate == null) {
            this.endDate = this.startDate.plusDays(7);
        }
        // Keep premium and weeklyPremium in sync
        if (this.weeklyPremium == null && this.premium != null) {
            this.weeklyPremium = this.premium;
        }
        if (this.premium == null && this.weeklyPremium != null) {
            this.premium = this.weeklyPremium;
        }
    }
}