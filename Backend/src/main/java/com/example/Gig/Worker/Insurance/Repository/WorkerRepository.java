package com.example.Gig.Worker.Insurance.Repository;

import com.example.Gig.Worker.Insurance.Model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {

    // Existing
    Optional<Worker> findByPhoneNumber(Long phoneNumber);

    // Used by AuthController — fetch worker profile linked to a User
    Optional<Worker> findByUserId(Long id);

    // Used by WorkerService
    Optional<Worker> findByWorkerId(String workerId);

    // Used by Admin screens
    List<Worker> findByCity(String city);
    List<Worker> findByPlatform(String platform);
}