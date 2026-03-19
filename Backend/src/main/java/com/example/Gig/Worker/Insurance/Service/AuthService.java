package com.example.Gig.Worker.Insurance.Service;

import com.example.Gig.Worker.Insurance.DTO.LoginRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.RegisterRequestDTO;

import java.util.Map;

public interface AuthService {

    // Returns { token, role, email, name, workerId } — matches frontend setSession()
    Map<String, Object> register(RegisterRequestDTO request);

    // Returns { token, role, email, name, workerId } — matches frontend setSession()
    Map<String, Object> login(LoginRequestDTO request);
}