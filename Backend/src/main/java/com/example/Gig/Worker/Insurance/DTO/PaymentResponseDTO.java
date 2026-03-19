package com.example.Gig.Worker.Insurance.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponseDTO {
    private Long id;
    private Long workerId;
    private Long claimId;           // linked claim
    private Double amount;
    private String paymentType;     // "PREMIUM" or "PAYOUT"
    private String paymentMethod;   // "UPI", "BANK_TRANSFER", "WALLET"
    private String paymentStatus;   // "SUCCESS", "PENDING", "FAILED"
    private LocalDateTime paymentDate;
}