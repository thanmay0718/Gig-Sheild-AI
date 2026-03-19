package com.example.Gig.Worker.Insurance.Service;

import com.example.Gig.Worker.Insurance.DTO.PaymentRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.PaymentResponseDTO;
import com.example.Gig.Worker.Insurance.Model.Payment;
import com.example.Gig.Worker.Insurance.Repository.PaymentRepository;
import com.example.Gig.Worker.Insurance.exception.ResourceNotFoundException;
import com.example.Gig.Worker.Insurance.mapper.PaymentMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public PaymentResponseDTO createPayment(PaymentRequestDTO request) {
        Payment payment = PaymentMapper.toEntity(request);

        // ── Mock payment gateway simulation ──────────────────────────────────
        // In production this would call Razorpay/Stripe/UPI API
        // For hackathon: auto-mark as SUCCESS
        payment.setPaymentStatus("SUCCESS");

        payment = paymentRepository.save(payment);
        return PaymentMapper.toResponseDTO(payment);
    }

    @Override
    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(PaymentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ── ADDED: filter by workerId — called via GET /payments?workerId= ────────
    public List<PaymentResponseDTO> getPaymentsByWorker(Long workerId) {
        return paymentRepository.findByWorkerId(workerId)
                .stream()
                .map(PaymentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentResponseDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Payment not found with id: " + id));
        return PaymentMapper.toResponseDTO(payment);
    }
}