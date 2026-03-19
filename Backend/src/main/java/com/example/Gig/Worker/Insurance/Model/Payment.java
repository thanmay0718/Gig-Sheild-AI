package com.example.Gig.Worker.Insurance.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long workerId;

    private Long claimId;           // which claim triggered this payout (nullable for premiums)

    private Double amount;

    private String paymentType;     // "PREMIUM" (worker pays in) or "PAYOUT" (worker receives)

    private String paymentMethod;   // "UPI", "BANK_TRANSFER", "WALLET"

    private String paymentStatus;   // "SUCCESS", "PENDING", "FAILED"

    // ── FIXED: was LocalDate — changed to LocalDateTime for consistency ───────
    private LocalDateTime paymentDate;

    @PrePersist
    public void setPaymentDate() {
        if (this.paymentDate == null) {
            this.paymentDate = LocalDateTime.now();
        }
        if (this.paymentStatus == null) {
            this.paymentStatus = "PENDING";
        }
    }
}