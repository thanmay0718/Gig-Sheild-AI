package com.example.Gig.Worker.Insurance.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDTO {
    private Long workerId;
    private Long claimId;           // which claim triggered this payout
    private Double amount;
    private String paymentType;     // "PREMIUM" (worker pays) or "PAYOUT" (worker receives)
    private String paymentMethod;   // "UPI", "BANK_TRANSFER", "WALLET"
}