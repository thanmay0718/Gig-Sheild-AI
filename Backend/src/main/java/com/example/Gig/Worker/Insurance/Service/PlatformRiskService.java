package com.example.Gig.Worker.Insurance.Service;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class PlatformRiskService {

    public double calculate(String platform) {
        // Risk based on platform type
        // Q-Commerce = highest risk (10-min delivery pressure)
        Map<String, Double> platformRiskMap = Map.ofEntries(
                Map.entry("ZOMATO",    40.0),   // Food delivery
                Map.entry("SWIGGY",    40.0),   // Food delivery
                Map.entry("BLINKIT",   70.0),   // Q-Commerce, high pressure
                Map.entry("ZEPTO",     70.0),   // Q-Commerce, high pressure
                Map.entry("AMAZON",    35.0),   // Scheduled delivery, lower risk
                Map.entry("FLIPKART",  35.0),   // Scheduled delivery, lower risk
                Map.entry("DUNZO",     65.0),   // Hyperlocal, moderate-high
                Map.entry("BIGBASKET", 45.0),   // Grocery, moderate
                Map.entry("RAPIDO",    55.0),   // Bike taxi
                Map.entry("PORTER",    50.0)    // Logistics
        );

        String normalizedPlatform = platform != null ? platform.trim().toUpperCase() : "";
        return platformRiskMap.getOrDefault(normalizedPlatform, 50.0);
    }
}