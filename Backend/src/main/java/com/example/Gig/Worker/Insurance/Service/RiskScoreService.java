package com.example.Gig.Worker.Insurance.Service;

import com.example.Gig.Worker.Insurance.DTO.RiskFactorsDTO;
import com.example.Gig.Worker.Insurance.Model.RiskScore;
import com.example.Gig.Worker.Insurance.Repository.RiskScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class RiskScoreService {

    @Autowired private WeatherRiskScore weatherRiskScore;
    @Autowired private ZoneRiskService zoneRiskService;
    @Autowired private WorkerHistoryRiskService workerHistoryRiskService;
    @Autowired private PlatformRiskService platformRiskService;
    @Autowired private SocialRiskService socialRiskService;
    @Autowired private RiskScoreRepository riskScoreRepository;

    public RiskFactorsDTO calculateRisk(Long workerId, String city,
                                        String zone, String platform) {

        // Step 1 — Calculate each factor (0-100)
        double weather = weatherRiskScore.calculate(city);
        double zoneS   = zoneRiskService.calculate(zone);
        double history = workerHistoryRiskService.calculate(workerId);
        double platf   = platformRiskService.calculate(platform);
        double social  = socialRiskService.calculate(city);

        // Step 2 — Weighted final score
        double finalScore = (weather * 0.30) +
                (zoneS   * 0.20) +
                (history * 0.20) +
                (platf   * 0.15) +
                (social  * 0.15);

        // Step 3 — Risk level
        String riskLevel = finalScore <= 30 ? "LOW"
                : finalScore <= 60 ? "MEDIUM"
                : "HIGH";

        // Step 4 — Weekly premium (₹ based on risk)
        double weeklyPremium = switch (riskLevel) {
            case "LOW"    -> 49.0;
            case "MEDIUM" -> 79.0;
            default       -> 119.0;
        };

        // Step 5 — Summary message
        String message = String.format(
                "Risk assessment complete. Final Score: %.1f | Level: %s | Weekly Premium: ₹%.0f",
                finalScore, riskLevel, weeklyPremium
        );

        // Step 6 — Persist to DB
        RiskScore riskScore = RiskScore.builder()
                .workerId(workerId)
                .weatherScore(weather)
                .zoneScore(zoneS)
                .historyScore(history)
                .platformScore(platf)
                .socialScore(social)
                .finalScore(finalScore)
                .riskLevel(riskLevel)
                .weekStartDate(LocalDate.now())
                .calculatedAt(LocalDateTime.now())
                .build();

        riskScoreRepository.save(riskScore);

        // Step 7 — Return DTO
        return RiskFactorsDTO.builder()
                .workerId(workerId)
                .weatherScore(weather)
                .zoneScore(zoneS)
                .historyScore(history)
                .platformScore(platf)
                .socialScore(social)
                .finalScore(finalScore)
                .riskLevel(riskLevel)
                .weeklyPremium(weeklyPremium)
                .message(message)
                .build();
    }
}