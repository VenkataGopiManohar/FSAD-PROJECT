package com.edulib.backend.controller;

import com.edulib.backend.service.AuthorizationService;
import com.edulib.backend.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users/{userId}/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final AuthorizationService authorizationService;

    public BookmarkController(BookmarkService bookmarkService, AuthorizationService authorizationService) {
        this.bookmarkService = bookmarkService;
        this.authorizationService = authorizationService;
    }

    @GetMapping
    public ResponseEntity<List<String>> getBookmarks(@PathVariable String userId, Authentication authentication) {
        authorizationService.assertSelfOrAdmin(userId, authentication);
        return ResponseEntity.ok(bookmarkService.getBookmarks(userId));
    }

    @PostMapping("/{resourceId}")
    public ResponseEntity<Map<String, Object>> addBookmark(@PathVariable String userId,
                                                            @PathVariable String resourceId,
                                                            Authentication authentication) {
        authorizationService.assertSelfOrAdmin(userId, authentication);
        return ResponseEntity.ok(bookmarkService.addBookmark(userId, resourceId));
    }

    @DeleteMapping("/{resourceId}")
    public ResponseEntity<Map<String, Object>> removeBookmark(@PathVariable String userId,
                                                               @PathVariable String resourceId,
                                                               Authentication authentication) {
        authorizationService.assertSelfOrAdmin(userId, authentication);
        return ResponseEntity.ok(bookmarkService.removeBookmark(userId, resourceId));
    }
}
