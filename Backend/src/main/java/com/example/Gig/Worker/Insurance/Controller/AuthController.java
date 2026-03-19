package com.example.Gig.Worker.Insurance.Controller;

import com.example.Gig.Worker.Insurance.DTO.LoginRequestDTO;
import com.example.Gig.Worker.Insurance.DTO.RegisterRequestDTO;
import com.example.Gig.Worker.Insurance.Model.User;
import com.example.Gig.Worker.Insurance.Model.Worker;
import com.example.Gig.Worker.Insurance.Repository.UserRepository;
import com.example.Gig.Worker.Insurance.Repository.WorkerRepository;
import com.example.Gig.Worker.Insurance.security.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:9091", "http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository,
                          WorkerRepository workerRepository,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.jwtUtil = jwtUtil;
    }

    // ─── LOGIN ────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequestDTO request) {
        Map<String, Object> response = new HashMap<>();

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            response.put("error", "Email is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Optional<User> userOptional = userRepository.findByEmail(request.getEmail().toLowerCase().trim());
        if (userOptional.isEmpty()) {
            response.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        User user = userOptional.get();

        if (user.getPassword() == null || !encoder.matches(request.getPassword(), user.getPassword())) {
            response.put("error", "Invalid password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // ── FIX: always return role as UPPERCASE so frontend routing works ──
        // Frontend checks: resolvedRole === "ADMIN" ? "/admin" : "/worker"
        // If DB has "admin" (lowercase), routing breaks → always force toUpperCase()
        String role = user.getRole() != null
                ? user.getRole().toUpperCase().trim()
                : "WORKER";

        String token = jwtUtil.generateToken(user.getEmail());

        Long workerId = null;
        String name = user.getEmail();

        // Only look for worker profile if role is WORKER
        if ("WORKER".equals(role)) {
            Optional<Worker> workerOptional = workerRepository.findByUserId(user.getId());
            if (workerOptional.isPresent()) {
                workerId = workerOptional.get().getId();
                if (workerOptional.get().getName() != null && !workerOptional.get().getName().isBlank()) {
                    name = workerOptional.get().getName();
                }
            }
        } else {
            // ADMIN — use email as name
            name = user.getEmail();
        }

        response.put("token", token);
        response.put("role", role);          // ALWAYS uppercase: "ADMIN" or "WORKER"
        response.put("email", user.getEmail());
        response.put("name", name);
        response.put("workerId", workerId);  // null for ADMIN, Long for WORKER

        return ResponseEntity.ok(response);
    }

    // ─── REGISTER ─────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequestDTO request) {
        Map<String, Object> response = new HashMap<>();

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            response.put("error", "Email is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.findByEmail(email).isPresent()) {
            response.put("error", "Email already registered");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        // ── FIX: always store role as UPPERCASE in DB ─────────────────────────
        String role = (request.getRole() != null && !request.getRole().isBlank())
                ? request.getRole().toUpperCase().trim()
                : "WORKER";

        String name = (request.getName() != null && !request.getName().isBlank())
                ? request.getName().trim()
                : email;

        // Create User
        User user = new User();
        user.setEmail(email);
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(role);
        userRepository.save(user);

        Long workerId = null;

        // Auto-create Worker profile only for WORKER role
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

        response.put("token", token);
        response.put("role", role);          // ALWAYS uppercase
        response.put("email", email);
        response.put("name", name);
        response.put("workerId", workerId);  // null for ADMIN

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}