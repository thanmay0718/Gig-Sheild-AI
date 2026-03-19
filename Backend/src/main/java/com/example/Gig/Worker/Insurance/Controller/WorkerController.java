package com.example.Gig.Worker.Insurance.Controller;

import com.example.Gig.Worker.Insurance.DTO.WorkerRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.WorkerResponseDTO;
import com.example.Gig.Worker.Insurance.Service.WorkerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workers")
@CrossOrigin(origins = "http://localhost:9091")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @PostMapping
    public WorkerResponseDTO createWorker(@Valid @RequestBody WorkerRequestDTO request){
        return workerService.createWorker(request);
    }

    @GetMapping
    public List<WorkerResponseDTO> getAllWorkers(){
        return workerService.getAllWorkers();
    }

    @GetMapping("/{id}")
    public WorkerResponseDTO getWorkerById(@PathVariable Long id){
        return workerService.getWorkerById(id);
    }

    @PutMapping("/{id}")
    public WorkerResponseDTO updateWorker(@PathVariable Long id,
                                          @RequestBody WorkerRequestDTO request){
        return workerService.updateWorker(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteWorker(@PathVariable Long id){
        workerService.deleteWorker(id);
        return "Worker Deleted Successfully";
    }
}
