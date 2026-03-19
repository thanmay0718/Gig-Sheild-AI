package com.example.Gig.Worker.Insurance.Service;

import com.example.Gig.Worker.Insurance.DTO.PaymentRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.PaymentResponseDTO;

import java.util.List;

public interface PaymentService {
    PaymentResponseDTO createPayment(PaymentRequestDTO request);
    List<PaymentResponseDTO> getAllPayments();
    List<PaymentResponseDTO> getPaymentsByWorker(Long workerId);    // worker dashboard
    PaymentResponseDTO getPaymentById(Long id);
}