package com.example.Gig.Worker.Insurance.Repository;

import com.example.Gig.Worker.Insurance.Model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Used by GET /payments?workerId=  — worker dashboard
    List<Payment> findByWorkerId(Long workerId);

    // Used by analytics — total payouts
    List<Payment> findByPaymentType(String paymentType);

    // Used by analytics — filter by status
    List<Payment> findByPaymentStatus(String paymentStatus);

    // Used when a claim is approved — find its linked payment
    List<Payment> findByClaimId(Long claimId);
}