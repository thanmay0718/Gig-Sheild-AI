package com.example.Gig.Worker.Insurance.Service;

import com.example.Gig.Worker.Insurance.DTO.WorkerRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.WorkerResponseDTO;

import java.util.List;

public interface WorkerService {
    WorkerResponseDTO createWorker(WorkerRequestDTO request);
    List<WorkerResponseDTO> getAllWorkers();
    WorkerResponseDTO getWorkerById(Long id);
    WorkerResponseDTO updateWorker(Long id, WorkerRequestDTO request);
    void deleteWorker(Long id);
}