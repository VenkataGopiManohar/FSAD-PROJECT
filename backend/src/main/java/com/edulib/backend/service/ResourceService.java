package com.edulib.backend.service;

import com.edulib.backend.dto.ResourceRequest;
import com.edulib.backend.dto.ResourceResponse;
import com.edulib.backend.dto.ResourceUpdateRequest;
import com.edulib.backend.dto.ReviewRequest;
import com.edulib.backend.dto.ReviewResponse;
import com.edulib.backend.dto.ReviewUpdateRequest;
import com.edulib.backend.model.Resource;
import com.edulib.backend.model.Review;
import com.edulib.backend.repository.ResourceRepository;
import com.edulib.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ReviewRepository reviewRepository;
    private final MapperService mapperService;
    private final Path uploadRoot;

    public ResourceService(ResourceRepository resourceRepository,
                           ReviewRepository reviewRepository,
                           MapperService mapperService,
                           @Value("${app.upload.dir:uploads}") String uploadDir) {
        this.resourceRepository = resourceRepository;
        this.reviewRepository = reviewRepository;
        this.mapperService = mapperService;
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @Transactional(readOnly = true)
    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAll().stream()
                .sorted(Comparator.comparing(Resource::getCreatedAt).reversed())
                .map(mapperService::toResourceResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResourceResponse getResourceById(String id) {
        Resource resource = getResourceEntity(id);
        return mapperService.toResourceResponse(resource);
    }

    @Transactional
    public ResourceResponse createResource(ResourceRequest request) {
        Resource resource = new Resource();
        resource.setTitle(request.getTitle());
        resource.setDescription(request.getDescription());
        resource.setAuthor(request.getAuthor());
        resource.setCategory(request.getCategory());
        resource.setSubject(request.getSubject());
        resource.setFileType(request.getFileType());
        resource.setFilePath(request.getFilePath());
        resource.setTags(mapperService.joinTags(request.getTags()));
        resource.setFeatured(request.getFeatured());
        resource.setDownloadCount(0);
        resource.setRating(0.0);
        resource.setCreatedAt(Instant.now());

        return mapperService.toResourceResponse(resourceRepository.save(resource));
    }

    @Transactional
    public ResourceResponse updateResource(String id, ResourceUpdateRequest request) {
        Resource resource = getResourceEntity(id);

        if (request.getTitle() != null) resource.setTitle(request.getTitle());
        if (request.getDescription() != null) resource.setDescription(request.getDescription());
        if (request.getAuthor() != null) resource.setAuthor(request.getAuthor());
        if (request.getCategory() != null) resource.setCategory(request.getCategory());
        if (request.getSubject() != null) resource.setSubject(request.getSubject());
        if (request.getFileType() != null) resource.setFileType(request.getFileType());
        if (request.getFilePath() != null) resource.setFilePath(request.getFilePath());
        if (request.getTags() != null) resource.setTags(mapperService.joinTags(request.getTags()));
        if (request.getFeatured() != null) resource.setFeatured(request.getFeatured());

        return mapperService.toResourceResponse(resourceRepository.save(resource));
    }

    @Transactional
    public Map<String, Object> deleteResource(String id) {
        Resource resource = getResourceEntity(id);
        resourceRepository.delete(resource);
        return Map.of("success", true);
    }

    @Transactional
    public ReviewResponse addReview(String resourceId, ReviewRequest request) {
        Resource resource = getResourceEntity(resourceId);

        Review review = new Review();
        review.setResource(resource);
        review.setUserId(request.getUserId());
        review.setUserName(request.getUserName());
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        if (request.getDate() != null && !request.getDate().isBlank()) {
            review.setDate(Instant.parse(request.getDate()));
        } else {
            review.setDate(Instant.now());
        }

        Review saved = reviewRepository.save(review);
        recalculateRating(resource);
        return mapperService.toReviewResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviews(String resourceId) {
        getResourceEntity(resourceId);
        return reviewRepository.findByResource_Id(resourceId).stream()
                .map(mapperService::toReviewResponse)
                .toList();
    }

    @Transactional
    public ReviewResponse updateReview(String resourceId, String reviewId, ReviewUpdateRequest request) {
        Review review = reviewRepository.findByResource_IdAndId(resourceId, reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        if (request.getRating() != null) {
            review.setRating(request.getRating());
        }
        if (request.getComment() != null && !request.getComment().isBlank()) {
            review.setComment(request.getComment());
        }

        Review saved = reviewRepository.save(review);
        recalculateRating(saved.getResource());
        return mapperService.toReviewResponse(saved);
    }

    @Transactional
    public Map<String, Object> deleteReview(String resourceId, String reviewId) {
        Review review = reviewRepository.findByResource_IdAndId(resourceId, reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        Resource resource = review.getResource();
        reviewRepository.delete(review);
        recalculateRating(resource);
        return Map.of("success", true);
    }

    @Transactional
    public void incrementDownloadCount(String resourceId) {
        Resource resource = getResourceEntity(resourceId);
        resource.setDownloadCount(resource.getDownloadCount() + 1);
        resourceRepository.save(resource);
    }

    @Transactional
    public ResourceResponse createResourceWithFile(String title,
                                                   String description,
                                                   String author,
                                                   String category,
                                                   String subject,
                                                   String fileType,
                                                   String tags,
                                                   Boolean featured,
                                                   MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "Uploaded file is required");
        }

        Resource resource = new Resource();
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setAuthor(author);
        resource.setCategory(category);
        resource.setSubject(subject);
        resource.setFileType(fileType);
        resource.setTags(tags == null ? "" : tags);
        resource.setFeatured(Boolean.TRUE.equals(featured));
        resource.setDownloadCount(0);
        resource.setRating(0.0);
        resource.setCreatedAt(Instant.now());
        resource.setFilePath(storeFile(file));

        return mapperService.toResourceResponse(resourceRepository.save(resource));
    }

    @Transactional
    public DownloadPayload getDownloadPayload(String resourceId) {
        Resource resource = getResourceEntity(resourceId);
        if (resource.getFilePath() == null || resource.getFilePath().isBlank()) {
            throw new ResponseStatusException(NOT_FOUND, "No file is associated with this resource");
        }

        Path path = Paths.get(resource.getFilePath()).toAbsolutePath().normalize();
        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            throw new ResponseStatusException(NOT_FOUND, "File not found");
        }

        try {
            UrlResource fileResource = new UrlResource(path.toUri());
            String filename = path.getFileName().toString();
            String mimeType = Files.probeContentType(path);
            MediaType mediaType = (mimeType == null || mimeType.isBlank())
                    ? MediaType.APPLICATION_OCTET_STREAM
                    : MediaType.parseMediaType(mimeType);

            incrementDownloadCount(resourceId);
            return new DownloadPayload(fileResource, filename, mediaType, Files.size(path));
        } catch (MalformedURLException e) {
            throw new ResponseStatusException(NOT_FOUND, "File not found", e);
        } catch (IOException e) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Could not read file", e);
        }
    }

    @Transactional(readOnly = true)
    public Resource getResourceEntity(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found"));
    }

    private void recalculateRating(Resource resource) {
        List<Review> reviews = reviewRepository.findByResource_Id(resource.getId());
        if (reviews.isEmpty()) {
            resource.setRating(0.0);
        } else {
            double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            resource.setRating(Math.round(avg * 10.0) / 10.0);
        }
        resourceRepository.save(resource);
    }

    private String storeFile(MultipartFile file) {
        try {
            Files.createDirectories(uploadRoot);

            String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null
                    ? "resource.bin"
                    : file.getOriginalFilename());
            String extension = "";
            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalName.substring(dotIndex);
            }
            String storedName = UUID.randomUUID().toString().replace("-", "") + extension;

            Path destination = uploadRoot.resolve(storedName).normalize();
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            return destination.toString();
        } catch (IOException e) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Failed to store uploaded file", e);
        }
    }

    public record DownloadPayload(org.springframework.core.io.Resource resource,
                                  String fileName,
                                  MediaType mediaType,
                                  long contentLength) {
    }
}
