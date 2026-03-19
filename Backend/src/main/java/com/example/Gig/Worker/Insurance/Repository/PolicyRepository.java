package com.example.Gig.Worker.Insurance.Repository;

import com.example.Gig.Worker.Insurance.Model.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {

    // Used by PolicyService
    List<Policy> findByWorkerId(Long workerId);

    // Used by AdminController analytics
    List<Policy> findByStatus(String status);

    // Used by analytics - count active policies
    long countByStatus(String status);
}