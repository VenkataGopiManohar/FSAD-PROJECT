package com.edulib.backend.service;

import com.edulib.backend.model.AppUser;
import com.edulib.backend.model.Bookmark;
import com.edulib.backend.model.Resource;
import com.edulib.backend.repository.AppUserRepository;
import com.edulib.backend.repository.BookmarkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final AppUserRepository appUserRepository;
    private final ResourceService resourceService;

    public BookmarkService(BookmarkRepository bookmarkRepository,
                           AppUserRepository appUserRepository,
                           ResourceService resourceService) {
        this.bookmarkRepository = bookmarkRepository;
        this.appUserRepository = appUserRepository;
        this.resourceService = resourceService;
    }

    @Transactional(readOnly = true)
    public List<String> getBookmarks(String userId) {
        return bookmarkRepository.findByUser_Id(userId).stream()
                .map(bookmark -> bookmark.getResource().getId())
                .toList();
    }

    @Transactional
    public Map<String, Object> addBookmark(String userId, String resourceId) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Resource resource = resourceService.getResourceEntity(resourceId);

        if (bookmarkRepository.findByUser_IdAndResource_Id(userId, resourceId).isEmpty()) {
            Bookmark bookmark = new Bookmark();
            bookmark.setUser(user);
            bookmark.setResource(resource);
            bookmarkRepository.save(bookmark);
        }

        return Map.of("success", true, "bookmarks", getBookmarks(userId));
    }

    @Transactional
    public Map<String, Object> removeBookmark(String userId, String resourceId) {
        bookmarkRepository.findByUser_IdAndResource_Id(userId, resourceId)
                .ifPresent(bookmarkRepository::delete);
        return Map.of("success", true, "bookmarks", getBookmarks(userId));
    }
}
