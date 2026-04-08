package com.edulib.backend.service;

import com.edulib.backend.dto.ChangePasswordRequest;
import com.edulib.backend.dto.UpdateStatusRequest;
import com.edulib.backend.dto.UserResponse;
import com.edulib.backend.model.AppUser;
import com.edulib.backend.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final AppUserRepository appUserRepository;
    private final MapperService mapperService;
    private final PasswordEncoder passwordEncoder;

    public UserService(AppUserRepository appUserRepository,
                       MapperService mapperService,
                       PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.mapperService = mapperService;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> getAllUsers() {
        return appUserRepository.findAll().stream().map(mapperService::toUserResponse).toList();
    }

    public UserResponse getUserById(String id) {
        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return mapperService.toUserResponse(user);
    }

    public UserResponse updateStatus(String id, UpdateStatusRequest request) {
        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(request.getStatus());
        return mapperService.toUserResponse(appUserRepository.save(user));
    }

    public Map<String, Object> changePassword(String id, ChangePasswordRequest request) {
        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        appUserRepository.save(user);
        return Map.of("success", true);
    }
}
