package com.example.Gig.Worker.Insurance.Controller;

import com.example.Gig.Worker.Insurance.DTO.RegisterRequestDTO;
import com.example.Gig.Worker.Insurance.Service.AuthService;
import com.example.Gig.Worker.Insurance.security.JwtUtil;
import com.example.Gig.Worker.Insurance.security.request.LoginRequestDTO;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:9091", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthController(AuthService authService,
                          JwtUtil jwtUtil,
                          AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    // ✅ REGISTER — now uses RegisterRequestDTO (has password)
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request,
                                   HttpServletResponse response) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // ✅ FIX: use service return
        String accessToken = authService.login(request);
        String refreshToken = jwtUtil.generateRefreshToken(request.getEmail());

        Cookie accessCookie = new Cookie("accessToken", accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(15 * 60);

        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(7 * 24 * 60 * 60);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        return ResponseEntity.ok("Login successful");
    }

    // ✅ PROFILE
    // ✅ FIX 3: Uncomment and properly handle null token
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {

        String token = extractTokenFromCookies(request, "accessToken");

        // ✅ FIXED: This was commented out — that caused NullPointerException
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("Unauthorized: Token missing or expired");
        }

        String email = jwtUtil.extractUsername(token);
        return ResponseEntity.ok(authService.getProfile(email));
    }

    // ✅ REFRESH
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request,
                                     HttpServletResponse response) {

        String refreshToken = extractTokenFromCookies(request, "refreshToken");

        if (refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }

        String email = jwtUtil.extractUsername(refreshToken);

        String newAccessToken = jwtUtil.generateAccessToken(email);

        Cookie newAccessCookie = new Cookie("accessToken", newAccessToken);
        newAccessCookie.setHttpOnly(true);
        newAccessCookie.setPath("/");
        newAccessCookie.setMaxAge(15 * 60);

        response.addCookie(newAccessCookie);

        return ResponseEntity.ok("Token refreshed");
    }

    // ✅ LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request,
                                    HttpServletResponse response) {

        String token = extractTokenFromCookies(request, "accessToken");

        if (token != null && jwtUtil.validateToken(token)) {
            String email = jwtUtil.extractUsername(token);
            String message = authService.logout(email);

            Cookie accessCookie = new Cookie("accessToken", null);
            accessCookie.setMaxAge(0);
            accessCookie.setPath("/");

            Cookie refreshCookie = new Cookie("refreshToken", null);
            refreshCookie.setMaxAge(0);
            refreshCookie.setPath("/");

            response.addCookie(accessCookie);
            response.addCookie(refreshCookie);

            return ResponseEntity.ok(message);
        }

        return ResponseEntity.status(401).body("Unauthorized");
    }

    private String extractTokenFromCookies(HttpServletRequest request, String name) {

        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals(name)) {
                return cookie.getValue();
            }
        }
        return null;
    }
}