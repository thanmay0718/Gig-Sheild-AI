package com.example.Gig.Worker.Insurance.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ── Auth endpoints ──────────────────────────────────────────
                        .requestMatchers("/api/auth/**").permitAll()

                        // ── Worker endpoints ────────────────────────────────────────
                        .requestMatchers("/workers/**").permitAll()

                        // ── Policy, Claims, Payments ─────────────────────────────────
                        .requestMatchers("/policies/**").permitAll()
                        .requestMatchers("/claims/**").permitAll()
                        .requestMatchers("/payments/**").permitAll()

                        // ── Risk & Admin endpoints ───────────────────────────────────
                        .requestMatchers("/api/risk/**").permitAll()
                        .requestMatchers("/admin/**").permitAll()
                        .requestMatchers("/api/admin/**").permitAll()

                        // ── Fraud alerts ─────────────────────────────────────────────
                        .requestMatchers("/fraud-alerts/**").permitAll()

                        // ── Everything else requires auth ────────────────────────────
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ── Allow all frontend origins ───────────────────────────────────────
        configuration.setAllowedOrigins(List.of(
                "http://localhost:9091",
                "http://localhost:5173",
                "http://localhost:3000"
        ));

        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}