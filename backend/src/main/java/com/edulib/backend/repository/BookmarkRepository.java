package com.edulib.backend.repository;

import com.edulib.backend.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUser_Id(String userId);
    Optional<Bookmark> findByUser_IdAndResource_Id(String userId, String resourceId);
}
