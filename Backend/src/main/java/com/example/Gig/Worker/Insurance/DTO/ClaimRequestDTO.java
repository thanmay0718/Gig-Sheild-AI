package com.example.Gig.Worker.Insurance.DTO;

import lombok.Data;

@Data
public class ClaimRequestDTO {

    private Long workerId;      // optional — null allowed for demo/testing

    private Long policyId;      // optional — which policy this claim is against

    // ── FIXED: accept BOTH 'title' and 'description' from frontend ────────────
    // Old WorkerClaims.jsx sends 'title' as the claim title
    // New WorkerClaims.jsx sends 'description'
    // We keep both fields and merge in ClaimService
    private String title;       // old frontend field — kept for compatibility

    private String description; // new frontend field — preferred

    private double amount;

    private String location;

    private String disruptionType;  // "WEATHER","FLOOD","RAIN","CURFEW","STRIKE","OTHER"

    // ── Helper: returns whichever description field is populated ──────────────
    public String getEffectiveDescription() {
        if (description != null && !description.isBlank()) return description;
        if (title != null && !title.isBlank()) return title;
        return null;
    }
}