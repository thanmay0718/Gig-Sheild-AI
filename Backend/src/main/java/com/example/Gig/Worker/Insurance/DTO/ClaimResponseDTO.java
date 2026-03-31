package com.example.Gig.Worker.Insurance.DTO;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClaimResponseDTO {


    private Long id;
    private String status;
    private boolean fraudFlag;
    private LocalDateTime updatedAt;

    public void setWorkerId(Long workerId) {
    }

    public void setPolicyId(Long policyId) {
    }

    public void setDescription(String description) {

    }

    public void setAmount(double amount) {
    }

    public void setLocation(String location) {
    }

    public void setClaimDate(LocalDateTime claimDate) {
    }
}