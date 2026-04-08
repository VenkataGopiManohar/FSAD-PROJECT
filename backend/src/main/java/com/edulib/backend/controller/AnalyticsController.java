package com.edulib.backend.controller;

import com.edulib.backend.service.AnalyticsService;
import com.edulib.backend.service.AuthorizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final AuthorizationService authorizationService;

    public AnalyticsController(AnalyticsService analyticsService, AuthorizationService authorizationService) {
        this.analyticsService = analyticsService;
        this.authorizationService = authorizationService;
    }

    @GetMapping("/downloads")
    public ResponseEntity<List<Map<String, Object>>> getDownloads(@RequestParam(defaultValue = "daily") String period,
                                                                  Authentication authentication) {
        authorizationService.assertAdmin(authentication);
        return ResponseEntity.ok(analyticsService.downloadTrends(period));
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers(Authentication authentication) {
        authorizationService.assertAdmin(authentication);
        return ResponseEntity.ok(analyticsService.usersTrend());
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(Authentication authentication) {
        authorizationService.assertAdmin(authentication);
        return ResponseEntity.ok(analyticsService.summary());
    }
}
