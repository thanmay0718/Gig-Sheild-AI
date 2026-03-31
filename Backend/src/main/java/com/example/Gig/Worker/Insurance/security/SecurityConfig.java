package com.example.Gig.Worker.Insurance.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // ❌ Disable CSRF
                .csrf(csrf -> csrf.disable())

                // ✅ Enable CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ✅ Stateless session
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 🔥 ROLE-BASED AUTHORIZATION
                .authorizeHttpRequests(auth -> auth

                        // ✅ Public endpoints
                        .requestMatchers("/auth/**").permitAll()

                        // 🔥 ROLE BASED
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/workers/**").hasRole("WORKER")

                        // ✅ Shared secured endpoints
                        .requestMatchers("/policies/**").authenticated()

                        // 🔒 Everything else
                        .anyRequest().authenticated()
                )

                // ✅ Handle unauthorized (401)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, ex1) -> {
                            response.setStatus(401);
                            response.getWriter().write("Unauthorized");
                        })
                )

                // ✅ JWT filter
                .addFilterBefore(jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 🔥 Authentication Manager
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // 🌐 CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:9091"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // 🔐 Password Encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}