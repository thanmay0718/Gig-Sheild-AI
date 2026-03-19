package com.example.Gig.Worker.Insurance.Service;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class WeatherRiskScore {

    public double calculate(String city) {
        // Mock weather risk data per city
        // In future replace with real Weather API (OpenWeatherMap etc.)
        Map<String, Double> weatherRiskMap = Map.ofEntries(
                Map.entry("Mumbai",    75.0),   // Flood prone
                Map.entry("Delhi",     65.0),   // Extreme heat + pollution
                Map.entry("Bangalore", 30.0),   // Mostly safe
                Map.entry("Chennai",   70.0),   // Cyclone prone
                Map.entry("Hyderabad", 45.0),   // Moderate
                Map.entry("Kolkata",   80.0),   // Heavy rain + flood
                Map.entry("Pune",      35.0),   // Mostly safe
                Map.entry("Ahmedabad", 60.0),   // Extreme heat
                Map.entry("Jaipur",    55.0),   // Dry heat
                Map.entry("Surat",     65.0)    // Flood prone
        );

        // Normalize city name for matching
        String normalizedCity = city != null
                ? city.trim().substring(0, 1).toUpperCase() + city.trim().substring(1).toLowerCase()
                : "";

        return weatherRiskMap.getOrDefault(normalizedCity, 50.0);
    }
}