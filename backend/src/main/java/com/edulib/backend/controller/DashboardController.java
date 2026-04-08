package com.edulib.backend.controller;

import com.edulib.backend.service.AnalyticsService;
import com.edulib.backend.service.AuthorizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final AnalyticsService analyticsService;
    private final AuthorizationService authorizationService;

    public DashboardController(AnalyticsService analyticsService, AuthorizationService authorizationService) {
        this.analyticsService = analyticsService;
        this.authorizationService = authorizationService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(Authentication authentication) {
        authorizationService.assertAdmin(authentication);
        return ResponseEntity.ok(analyticsService.dashboardStats());
    }
}
