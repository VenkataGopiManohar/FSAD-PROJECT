package com.edulib.backend.controller;

import com.edulib.backend.dto.HistoryCreateRequest;
import com.edulib.backend.dto.HistoryEntryResponse;
import com.edulib.backend.service.AuthorizationService;
import com.edulib.backend.service.HistoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users/{userId}/history")
public class HistoryController {

    private final HistoryService historyService;
    private final AuthorizationService authorizationService;

    public HistoryController(HistoryService historyService, AuthorizationService authorizationService) {
        this.historyService = historyService;
        this.authorizationService = authorizationService;
    }

    @GetMapping
    public ResponseEntity<List<HistoryEntryResponse>> getHistory(@PathVariable String userId,
                                                                 Authentication authentication) {
        authorizationService.assertSelfOrAdmin(userId, authentication);
        return ResponseEntity.ok(historyService.getHistory(userId));
    }

    @PostMapping
    public ResponseEntity<HistoryEntryResponse> addHistory(@PathVariable String userId,
                                                           @Valid @RequestBody HistoryCreateRequest request,
                                                           Authentication authentication) {
        authorizationService.assertSelfOrAdmin(userId, authentication);
        return ResponseEntity.ok(historyService.addHistory(userId, request));
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> clearHistory(@PathVariable String userId,
                                                            @RequestParam(required = false) String resourceId,
                                                            Authentication authentication) {
        authorizationService.assertSelfOrAdmin(userId, authentication);
        return ResponseEntity.ok(historyService.clearHistory(userId, resourceId));
    }
}
