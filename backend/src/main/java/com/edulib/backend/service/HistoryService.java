package com.edulib.backend.service;

import com.edulib.backend.dto.HistoryCreateRequest;
import com.edulib.backend.dto.HistoryEntryResponse;
import com.edulib.backend.model.AppUser;
import com.edulib.backend.model.HistoryEntry;
import com.edulib.backend.model.Resource;
import com.edulib.backend.repository.AppUserRepository;
import com.edulib.backend.repository.HistoryEntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class HistoryService {

    private final HistoryEntryRepository historyEntryRepository;
    private final AppUserRepository appUserRepository;
    private final ResourceService resourceService;

    public HistoryService(HistoryEntryRepository historyEntryRepository,
                          AppUserRepository appUserRepository,
                          ResourceService resourceService) {
        this.historyEntryRepository = historyEntryRepository;
        this.appUserRepository = appUserRepository;
        this.resourceService = resourceService;
    }

    @Transactional(readOnly = true)
    public List<HistoryEntryResponse> getHistory(String userId) {
        return historyEntryRepository.findByUser_IdOrderByTimestampDesc(userId).stream()
                .limit(50)
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public HistoryEntryResponse addHistory(String userId, HistoryCreateRequest request) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Resource resource = resourceService.getResourceEntity(request.getResourceId());

        historyEntryRepository.deleteByUser_IdAndResource_Id(userId, request.getResourceId());

        HistoryEntry entry = new HistoryEntry();
        entry.setUser(user);
        entry.setResource(resource);
        entry.setTimestamp(Instant.now());
        HistoryEntry saved = historyEntryRepository.save(entry);

        trimHistory(userId);
        return toResponse(saved);
    }

    @Transactional
    public Map<String, Object> clearHistory(String userId, String resourceId) {
        if (resourceId == null || resourceId.isBlank()) {
            List<HistoryEntry> all = historyEntryRepository.findByUser_IdOrderByTimestampDesc(userId);
            historyEntryRepository.deleteAll(all);
        } else {
            historyEntryRepository.deleteByUser_IdAndResource_Id(userId, resourceId);
        }
        return Map.of("success", true);
    }

    private HistoryEntryResponse toResponse(HistoryEntry entry) {
        HistoryEntryResponse response = new HistoryEntryResponse();
        response.setId(entry.getResource().getId());
        response.setTimestamp(entry.getTimestamp());
        return response;
    }

    private void trimHistory(String userId) {
        List<HistoryEntry> all = historyEntryRepository.findByUser_IdOrderByTimestampDesc(userId);
        if (all.size() > 50) {
            historyEntryRepository.deleteAll(all.subList(50, all.size()));
        }
    }
}
