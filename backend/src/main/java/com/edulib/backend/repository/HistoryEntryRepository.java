package com.edulib.backend.repository;

import com.edulib.backend.model.HistoryEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoryEntryRepository extends JpaRepository<HistoryEntry, Long> {
    List<HistoryEntry> findByUser_IdOrderByTimestampDesc(String userId);
    void deleteByUser_IdAndResource_Id(String userId, String resourceId);
}
