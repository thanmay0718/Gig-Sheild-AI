package com.example.Gig.Worker.Insurance.Service;

import com.example.Gig.Worker.Insurance.DTO.LoginRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.RegisterRequestDTO;
import com.example.Gig.Worker.Insurance.Model.User;
import com.example.Gig.Worker.Insurance.Model.Worker;
import com.example.Gig.Worker.Insurance.Repository.UserRepository;
import com.example.Gig.Worker.Insurance.Repository.WorkerRepository;
import com.example.Gig.Worker.Insurance.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired private WorkerRepository workerRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;

    // ── REGISTER ──────────────────────────────────────────────────────────────
    // FIXED: was returning WorkerResponseDTO — frontend expects
    // { token, role, email, name, workerId } to call setSession()
    @Override
    public Map<String, Object> register(RegisterRequestDTO request) {
        String email = request.getEmail().toLowerCase();
        String role  = request.getRole() != null
                ? request.getRole().toUpperCase()
                : "WORKER";
        String name  = request.getName() != null ? request.getName() : email;

        // Create User account
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        userRepository.save(user);

        // Auto-create Worker profile if role is WORKER
        Long workerId = null;
        if ("WORKER".equals(role)) {
            Worker worker = new Worker();
            worker.setName(name);
            worker.setUser(user);
            worker.setCity("");
            worker.setPlatform("");
            workerRepository.save(worker);
            workerId = worker.getId();
        }

        String token = jwtUtil.generateToken(email);

        // ── Return shape matches frontend AuthContext.setSession() ─────────
        Map<String, Object> response = new HashMap<>();
        response.put("token",    token);
        response.put("role",     role);
        response.put("email",    email);
        response.put("name",     name);
        response.put("workerId", workerId);

        return response;
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    @Override
    public Map<String, Object> login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Fetch linked worker profile if exists
        Long workerId = null;
        String name   = user.getEmail();
        Optional<Worker> workerOpt = workerRepository.findByUserId(user.getId());
        if (workerOpt.isPresent()) {
            workerId = workerOpt.get().getId();
            name     = workerOpt.get().getName();
        }

        String token = jwtUtil.generateToken(user.getEmail());

        // ── Return shape matches frontend AuthContext.setSession() ─────────
        Map<String, Object> response = new HashMap<>();
        response.put("token",    token);
        response.put("role",     user.getRole());
        response.put("email",    user.getEmail());
        response.put("name",     name);
        response.put("workerId", workerId);

        return response;
    }
}