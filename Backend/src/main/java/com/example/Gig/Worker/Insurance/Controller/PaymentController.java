package com.example.Gig.Worker.Insurance.Controller;

import com.example.Gig.Worker.Insurance.DTO.PaymentRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.PaymentResponseDTO;
import com.example.Gig.Worker.Insurance.Service.PaymentServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = {"http://localhost:9091", "http://localhost:5173", "http://localhost:3000"})
public class PaymentController {

    private final PaymentServiceImpl paymentService;

    public PaymentController(PaymentServiceImpl paymentService) {
        this.paymentService = paymentService;
    }

    // POST /payments
    @PostMapping
    public ResponseEntity<PaymentResponseDTO> createPayment(
            @RequestBody PaymentRequestDTO request) {
        return ResponseEntity.ok(paymentService.createPayment(request));
    }

    // GET /payments              → all payments (admin)
    // GET /payments?workerId=1   → filtered by worker (worker dashboard)
    @GetMapping
    public ResponseEntity<List<PaymentResponseDTO>> getPayments(
            @RequestParam(required = false) Long workerId) {
        if (workerId != null) {
            return ResponseEntity.ok(paymentService.getPaymentsByWorker(workerId));
        }
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // GET /payments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDTO> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }
}