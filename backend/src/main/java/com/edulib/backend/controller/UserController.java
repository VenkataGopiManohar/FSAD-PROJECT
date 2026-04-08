package com.edulib.backend.controller;

import com.edulib.backend.dto.ChangePasswordRequest;
import com.edulib.backend.dto.UpdateStatusRequest;
import com.edulib.backend.dto.UserResponse;
import com.edulib.backend.service.AuthorizationService;
import com.edulib.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthorizationService authorizationService;

    public UserController(UserService userService, AuthorizationService authorizationService) {
        this.userService = userService;
        this.authorizationService = authorizationService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(Authentication authentication) {
        authorizationService.assertAdmin(authentication);
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String id, Authentication authentication) {
        authorizationService.assertSelfOrAdmin(id, authentication);
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponse> updateStatus(@PathVariable String id,
                                                     @Valid @RequestBody UpdateStatusRequest request,
                                                     Authentication authentication) {
        authorizationService.assertAdmin(authentication);
        return ResponseEntity.ok(userService.updateStatus(id, request));
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<Map<String, Object>> changePassword(@PathVariable String id,
                                                              @Valid @RequestBody ChangePasswordRequest request,
                                                              Authentication authentication) {
        authorizationService.assertSelfOrAdmin(id, authentication);
        return ResponseEntity.ok(userService.changePassword(id, request));
    }
}
