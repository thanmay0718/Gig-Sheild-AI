package com.example.Gig.Worker.Insurance.Service;

import com.example.Gig.Worker.Insurance.DTO.WorkerRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.WorkerResponseDTO;
import com.example.Gig.Worker.Insurance.Model.Worker;
import com.example.Gig.Worker.Insurance.Model.User;
import com.example.Gig.Worker.Insurance.Repository.WorkerRepository;
import com.example.Gig.Worker.Insurance.Repository.UserRepository;
import com.example.Gig.Worker.Insurance.exception.ResourceNotFoundException;
import com.example.Gig.Worker.Insurance.mapper.WorkerMapper;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WorkerServiceImpl implements WorkerService {

    private final WorkerRepository workerRepository;
    private final UserRepository userRepository;

    public WorkerServiceImpl(WorkerRepository workerRepository,
                             UserRepository userRepository) {
        this.workerRepository = workerRepository;
        this.userRepository = userRepository;
    }

    @Override
    public WorkerResponseDTO createWorker(WorkerRequestDTO request) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String email = request.getEmail().toLowerCase();
        String role  = (request.getRole() != null)
                ? request.getRole().toUpperCase()
                : "WORKER";

        // ── Reuse existing User if email already registered (from /auth/register) ──
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPassword(encoder.encode(request.getPassword()));
            newUser.setRole(role);
            return userRepository.save(newUser);
        });

        // ── Reuse existing Worker profile if already created (from /auth/register) ──
        Optional<Worker> existingWorker = workerRepository.findByUserId(user.getId());
        Worker worker = existingWorker.orElseGet(() -> new Worker());

        // Update worker fields from request
        worker.setName(request.getName());
        worker.setCity(request.getCity());
        worker.setPlatform(request.getPlatform());
        worker.setPhoneNumber(request.getPhoneNumber());
        worker.setAvgIncome(request.getAvgIncome());
        worker.setUser(user);

        worker = workerRepository.save(worker);

        return WorkerMapper.toResponseDTO(worker);
    }

    @Override
    public List<WorkerResponseDTO> getAllWorkers() {
        return workerRepository.findAll()
                .stream()
                .map(WorkerMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WorkerResponseDTO getWorkerById(Long id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Worker not found with id: " + id));
        return WorkerMapper.toResponseDTO(worker);
    }

    @Override
    public WorkerResponseDTO updateWorker(Long id, WorkerRequestDTO request) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Worker not found with id: " + id));

        worker.setName(request.getName());
        worker.setCity(request.getCity());
        worker.setPlatform(request.getPlatform());
        worker.setPhoneNumber(request.getPhoneNumber());
        worker.setAvgIncome(request.getAvgIncome());
        // Do NOT reset riskScore on update — keep computed value
        // worker.setRiskScore(null);  ← removed

        Worker updatedWorker = workerRepository.save(worker);
        return WorkerMapper.toResponseDTO(updatedWorker);
    }

    @Override
    public void deleteWorker(Long id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Worker not found with id: " + id));
        workerRepository.delete(worker);
    }
}