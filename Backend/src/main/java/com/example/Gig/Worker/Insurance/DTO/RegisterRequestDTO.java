package com.example.Gig.Worker.Insurance.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {
    private String email;
    private String password;
    private String role;   // "WORKER" or "ADMIN"
    private String name;   // optional
}