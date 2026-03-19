package com.example.Gig.Worker.Insurance.mapper;

import com.example.Gig.Worker.Insurance.DTO.PaymentRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.PaymentResponseDTO;
import com.example.Gig.Worker.Insurance.Model.Payment;

public class PaymentMapper {

    public static Payment toEntity(PaymentRequestDTO dto) {
        Payment payment = new Payment();
        payment.setWorkerId(dto.getWorkerId());
        payment.setClaimId(dto.getClaimId());
        payment.setAmount(dto.getAmount());
        payment.setPaymentType(dto.getPaymentType());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setPaymentStatus("PENDING"); // starts as PENDING, confirmed by mock gateway
        return payment;
    }

    public static PaymentResponseDTO toResponseDTO(Payment payment) {
        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setId(payment.getId());
        dto.setWorkerId(payment.getWorkerId());
        dto.setClaimId(payment.getClaimId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentType(payment.getPaymentType());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setPaymentStatus(payment.getPaymentStatus());
        // ── FIXED: no more .atStartOfDay() — already LocalDateTime ───────────
        dto.setPaymentDate(payment.getPaymentDate());
        return dto;
    }
}