package com.example.Gig.Worker.Insurance.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
        })
public class User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;    // Always stored as UPPERCASE: "ADMIN" or "WORKER"

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) {
        this.email = email != null ? email.toLowerCase().trim() : null;
    }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) {
        // ── FIX: always store role as UPPERCASE ───────────────────────────────
        // Prevents "admin" in DB causing routing to /worker instead of /admin
        this.role = role != null ? role.toUpperCase().trim() : "WORKER";
    }
}