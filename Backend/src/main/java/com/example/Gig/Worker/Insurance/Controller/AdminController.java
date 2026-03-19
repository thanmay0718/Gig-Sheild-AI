package com.example.Gig.Worker.Insurance.Controller;

import com.example.Gig.Worker.Insurance.Model.Claim;
import com.example.Gig.Worker.Insurance.Model.Worker;
import com.example.Gig.Worker.Insurance.Repository.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = {"http://localhost:9091", "http://localhost:5173", "http://localhost:3000"})
public class AdminController {

    private final ClaimRepository claimRepository;
    private final PaymentRepository paymentRepository;
    private final PolicyRepository policyRepository;
    private final RiskScoreRepository riskScoreRepository;
    private final WorkerRepository workerRepository;

    public AdminController(ClaimRepository claimRepository,
                           PaymentRepository paymentRepository,
                           PolicyRepository policyRepository,
                           RiskScoreRepository riskScoreRepository,
                           WorkerRepository workerRepository) {
        this.claimRepository    = claimRepository;
        this.paymentRepository  = paymentRepository;
        this.policyRepository   = policyRepository;
        this.riskScoreRepository = riskScoreRepository;
        this.workerRepository   = workerRepository;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /admin/analytics/risk
    // Analytics.jsx → getRiskDistribution()
    // MinimalBarChart expects: [{ label, value, color }]
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping("/admin/analytics/risk")
    public ResponseEntity<List<Map<String, Object>>> getRiskDistribution() {
        long low    = riskScoreRepository.countByRiskLevel("LOW");
        long medium = riskScoreRepository.countByRiskLevel("MEDIUM");
        long high   = riskScoreRepository.countByRiskLevel("HIGH");

        List<Map<String, Object>> distribution = List.of(
                Map.of("label", "LOW",    "value", low,    "color", "#22c55e"),
                Map.of("label", "MEDIUM", "value", medium, "color", "#f59e0b"),
                Map.of("label", "HIGH",   "value", high,   "color", "#ef4444")
        );
        return ResponseEntity.ok(distribution);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /admin/analytics/claims
    // Analytics.jsx → getClaimStatusBreakdown()
    // MinimalPieChart expects: [{ label, value, color }]
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping("/admin/analytics/claims")
    public ResponseEntity<List<Map<String, Object>>> getClaimStatusBreakdown() {
        long pending  = claimRepository.countByStatus("PENDING");
        long approved = claimRepository.countByStatus("APPROVED");
        long rejected = claimRepository.countByStatus("REJECTED");

        List<Map<String, Object>> breakdown = List.of(
                Map.of("label", "PENDING",  "value", pending,  "color", "#f59e0b"),
                Map.of("label", "APPROVED", "value", approved, "color", "#22c55e"),
                Map.of("label", "REJECTED", "value", rejected, "color", "#ef4444")
        );
        return ResponseEntity.ok(breakdown);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /admin/analytics/dashboard
    // AdminDashboard.jsx MetricCards
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping("/admin/analytics/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics() {
        Map<String, Object> res = new HashMap<>();

        res.put("totalWorkers",   workerRepository.count());
        res.put("totalClaims",    claimRepository.count());
        res.put("totalPolicies",  policyRepository.count());
        res.put("activePolicies", policyRepository.findByStatus("ACTIVE").size());
        res.put("fraudCount",     claimRepository.findByFraudFlagTrue().size());

        double payouts  = paymentRepository.findByPaymentType("PAYOUT")
                .stream().mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0).sum();
        double premiums = paymentRepository.findByPaymentType("PREMIUM")
                .stream().mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0).sum();

        res.put("totalPayouts",  payouts);
        res.put("totalPremiums", premiums);
        res.put("lossRatio",     premiums > 0
                ? Math.round((payouts / premiums) * 1000.0) / 10.0 : 0.0);

        return ResponseEntity.ok(res);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /workers
    // AdminWorkers.jsx + AdminDashboard.jsx worker table
    // Expects: [{ id, name, city, policy, risk, claims, platform, email }]
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping("/admin/workers")
    public ResponseEntity<List<Map<String, Object>>> getAllWorkers() {
        List<Map<String, Object>> result = workerRepository.findAll()
                .stream()
                .map(worker -> {
                    Map<String, Object> w = new HashMap<>();
                    w.put("id",       worker.getId());
                    w.put("workerId", worker.getWorkerId());
                    w.put("name",     worker.getName() != null ? worker.getName() : "—");
                    w.put("city",     worker.getCity() != null ? worker.getCity() : "—");
                    w.put("platform", worker.getPlatform() != null ? worker.getPlatform() : "—");
                    w.put("email",    worker.getUser() != null
                            ? worker.getUser().getEmail() : "—");
                    w.put("risk",     worker.getRiskScore() != null
                            ? worker.getRiskScore() : 0.0);

                    // Latest ACTIVE policy type or "None"
                    String policy = policyRepository.findByWorkerId(worker.getId())
                            .stream()
                            .filter(p -> "ACTIVE".equals(p.getStatus()))
                            .map(p -> p.getPolicyType())
                            .findFirst()
                            .orElse("None");
                    w.put("policy", policy);

                    // Total claims count
                    w.put("claims", claimRepository.findByWorkerId(worker.getId()).size());

                    return w;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /fraud-alerts
    // FraudAlerts.jsx + AdminDashboard.jsx
    // Expects: [{ id, title, severity, worker, time }]
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping("/fraud-alerts")
    public ResponseEntity<List<Map<String, Object>>> getFraudAlerts() {
        List<Map<String, Object>> alerts = claimRepository.findByFraudFlagTrue()
                .stream()
                .map(claim -> {
                    Map<String, Object> alert = new HashMap<>();
                    alert.put("id", claim.getId());

                    // title — readable fraud description
                    String type = claim.getDisruptionType() != null
                            ? claim.getDisruptionType() : "Unknown";
                    alert.put("title", "Suspicious " + type + " claim — ₹"
                            + String.format("%.0f", claim.getAmount()));

                    // severity based on amount thresholds
                    String severity = claim.getAmount() > 3000 ? "High"
                            : claim.getAmount() > 1500 ? "Medium" : "Low";
                    alert.put("severity", severity);

                    // worker name
                    String workerName = workerRepository.findById(claim.getWorkerId())
                            .map(Worker::getName)
                            .orElse("Worker #" + claim.getWorkerId());
                    alert.put("worker", workerName);

                    // time as ISO string → formatRelativeTime() in frontend
                    alert.put("time", claim.getClaimDate() != null
                            ? claim.getClaimDate().toString() : "");

                    // extra fields for detail view
                    alert.put("amount",         claim.getAmount());
                    alert.put("location",       claim.getLocation());
                    alert.put("status",         claim.getStatus());
                    alert.put("disruptionType", claim.getDisruptionType());

                    return alert;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(alerts);
    }
}