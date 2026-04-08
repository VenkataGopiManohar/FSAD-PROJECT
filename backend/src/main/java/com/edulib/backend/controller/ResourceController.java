package com.edulib.backend.controller;

import com.edulib.backend.dto.ResourceRequest;
import com.edulib.backend.dto.ResourceResponse;
import com.edulib.backend.dto.ResourceUpdateRequest;
import com.edulib.backend.dto.ReviewRequest;
import com.edulib.backend.dto.ReviewResponse;
import com.edulib.backend.dto.ReviewUpdateRequest;
import com.edulib.backend.service.AuthorizationService;
import com.edulib.backend.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;
    private final AuthorizationService authorizationService;

    public ResourceController(ResourceService resourceService, AuthorizationService authorizationService) {
        this.resourceService = resourceService;
        this.authorizationService = authorizationService;
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponse>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponse> getResourceById(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<org.springframework.core.io.Resource> downloadResource(@PathVariable String id) {
        ResourceService.DownloadPayload payload = resourceService.getDownloadPayload(id);

        return ResponseEntity.ok()
                .contentType(payload.mediaType())
                .contentLength(payload.contentLength())
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + payload.fileName() + "\"")
                .body(payload.resource());
    }

    @PostMapping
    public ResponseEntity<ResourceResponse> createResource(@Valid @RequestBody ResourceRequest request,
                                                           Authentication authentication) {
        authorizationService.assertAdmin(authentication);
        return ResponseEntity.ok(resourceService.createResource(request));
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResourceResponse> uploadResource(@RequestParam String title,
                                                           @RequestParam String description,
                                                           @RequestParam String author,
                                                           @RequestParam String category,
                                                           @RequestParam String subject,
                                                           @RequestParam String fileType,
                                                           @RequestParam(required = false, defaultValue = "") String tags,
                                                           @RequestParam(required = false, defaultValue = "false") Boolean featured,
                                                           @RequestParam("file") MultipartFile file,
                                                           Authentication authentication) {
        authorizationService.assertAdmin(authentication);
        return ResponseEntity.ok(resourceService.createResourceWithFile(
                title,
                description,
                author,
                category,
                subject,
                fileType,
                tags,
                featured,
                file
        ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResourceResponse> updateResource(@PathVariable String id,
                                                           @RequestBody ResourceUpdateRequest request,
                                                           Authentication authentication) {
        authorizationService.assertAdmin(authentication);
        return ResponseEntity.ok(resourceService.updateResource(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteResource(@PathVariable String id,
                                                               Authentication authentication) {
        authorizationService.assertAdmin(authentication);
        return ResponseEntity.ok(resourceService.deleteResource(id));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getReviews(id));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewResponse> addReview(@PathVariable String id,
                                                    @Valid @RequestBody ReviewRequest request,
                                                    Authentication authentication) {
        authorizationService.assertSelfOrAdmin(request.getUserId(), authentication);
        return ResponseEntity.ok(resourceService.addReview(id, request));
    }

    @PatchMapping("/{resourceId}/reviews/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(@PathVariable String resourceId,
                                                       @PathVariable String reviewId,
                                                       @RequestBody ReviewUpdateRequest request,
                                                       Authentication authentication) {
        authorizationService.assertAdmin(authentication);
        return ResponseEntity.ok(resourceService.updateReview(resourceId, reviewId, request));
    }

    @DeleteMapping("/{resourceId}/reviews/{reviewId}")
    public ResponseEntity<Map<String, Object>> deleteReview(@PathVariable String resourceId,
                                                            @PathVariable String reviewId,
                                                            Authentication authentication) {
        authorizationService.assertAdmin(authentication);
        return ResponseEntity.ok(resourceService.deleteReview(resourceId, reviewId));
    }
}
