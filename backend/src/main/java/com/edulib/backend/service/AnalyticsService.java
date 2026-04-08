package com.edulib.backend.service;

import com.edulib.backend.model.HistoryEntry;
import com.edulib.backend.model.Resource;
import com.edulib.backend.repository.AppUserRepository;
import com.edulib.backend.repository.HistoryEntryRepository;
import com.edulib.backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class AnalyticsService {

    private final HistoryEntryRepository historyEntryRepository;
    private final AppUserRepository appUserRepository;
    private final ResourceRepository resourceRepository;

    public AnalyticsService(HistoryEntryRepository historyEntryRepository,
                            AppUserRepository appUserRepository,
                            ResourceRepository resourceRepository) {
        this.historyEntryRepository = historyEntryRepository;
        this.appUserRepository = appUserRepository;
        this.resourceRepository = resourceRepository;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> downloadTrends(String period) {
        if ("monthly".equalsIgnoreCase(period)) {
            return monthlyDownloads();
        }
        return dailyDownloads();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> usersTrend() {
        LocalDate now = LocalDate.now(ZoneOffset.UTC);
        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = 4; i >= 0; i--) {
            LocalDate month = now.minusMonths(i);
            String name = month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            long users = appUserRepository.findAll().stream()
                    .filter(user -> user.getJoinedAt().atZone(ZoneOffset.UTC).getMonth() == month.getMonth()
                            && user.getJoinedAt().atZone(ZoneOffset.UTC).getYear() == month.getYear())
                    .count();
            trend.add(Map.of("name", name, "users", users));
        }
        return trend;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> summary() {
        long totalUsers = appUserRepository.count();
        long totalResources = resourceRepository.count();
        int totalDownloads = resourceRepository.findAll().stream().mapToInt(Resource::getDownloadCount).sum();
        double avgRating = resourceRepository.findAll().stream().mapToDouble(Resource::getRating).average().orElse(0.0);
        avgRating = Math.round(avgRating * 10.0) / 10.0;

        return Map.of(
                "totalUsers", totalUsers,
                "totalResources", totalResources,
                "totalDownloads", totalDownloads,
                "avgRating", avgRating
        );
    }

            @Transactional(readOnly = true)
            public Map<String, Object> dashboardStats() {
            long totalResources = resourceRepository.count();
            int totalDownloads = resourceRepository.findAll().stream().mapToInt(Resource::getDownloadCount).sum();
            long activeUsers = appUserRepository.findAll().stream()
                .filter(user -> "active".equalsIgnoreCase(user.getStatus()))
                .count();
            double avgRating = resourceRepository.findAll().stream().mapToDouble(Resource::getRating).average().orElse(0.0);
            avgRating = Math.round(avgRating * 10.0) / 10.0;

            return Map.of(
                "totalResources", totalResources,
                "totalDownloads", totalDownloads,
                "activeUsers", activeUsers,
                "avgRating", avgRating
            );
            }

    private List<Map<String, Object>> dailyDownloads() {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        Map<DayOfWeek, Long> counts = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            counts.put(date.getDayOfWeek(), 0L);
        }

        List<HistoryEntry> all = historyEntryRepository.findAll();
        for (HistoryEntry entry : all) {
            LocalDate date = entry.getTimestamp().atZone(ZoneOffset.UTC).toLocalDate();
            long diff = today.toEpochDay() - date.toEpochDay();
            if (diff >= 0 && diff <= 6) {
                DayOfWeek dow = date.getDayOfWeek();
                counts.put(dow, counts.getOrDefault(dow, 0L) + 1);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        counts.forEach((dow, value) -> result.add(Map.of(
                "name", dow.getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                "downloads", value
        )));
        return result;
    }

    private List<Map<String, Object>> monthlyDownloads() {
        LocalDate now = LocalDate.now(ZoneOffset.UTC);
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 4; i >= 0; i--) {
            LocalDate month = now.minusMonths(i);
            String name = month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            long downloads = historyEntryRepository.findAll().stream()
                    .filter(h -> h.getTimestamp().atZone(ZoneOffset.UTC).getMonth() == month.getMonth()
                            && h.getTimestamp().atZone(ZoneOffset.UTC).getYear() == month.getYear())
                    .count();
            result.add(Map.of("name", name, "downloads", downloads));
        }
        return result;
    }
}
