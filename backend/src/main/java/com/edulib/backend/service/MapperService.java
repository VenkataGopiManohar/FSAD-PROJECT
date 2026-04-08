package com.edulib.backend.service;

import com.edulib.backend.dto.ResourceResponse;
import com.edulib.backend.dto.ReviewResponse;
import com.edulib.backend.dto.UserResponse;
import com.edulib.backend.model.AppUser;
import com.edulib.backend.model.Resource;
import com.edulib.backend.model.Review;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class MapperService {

    public UserResponse toUserResponse(AppUser user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setJoinedAt(user.getJoinedAt());
        response.setStatus(user.getStatus());
        return response;
    }

    public ResourceResponse toResourceResponse(Resource resource) {
        ResourceResponse response = new ResourceResponse();
        response.setId(resource.getId());
        response.setTitle(resource.getTitle());
        response.setDescription(resource.getDescription());
        response.setAuthor(resource.getAuthor());
        response.setCategory(resource.getCategory());
        response.setSubject(resource.getSubject());
        response.setFileType(resource.getFileType());
        response.setFilePath(resource.getFilePath());
        response.setTags(splitTags(resource.getTags()));
        response.setDownloadCount(resource.getDownloadCount());
        response.setRating(resource.getRating());
        response.setFeatured(resource.getFeatured());
        response.setCreatedAt(resource.getCreatedAt());
        response.setReviews(resource.getReviews().stream().map(this::toReviewResponse).toList());
        return response;
    }

    public ReviewResponse toReviewResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setUserId(review.getUserId());
        response.setUserName(review.getUserName());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setDate(review.getDate());
        return response;
    }

    public List<String> splitTags(String tags) {
        if (tags == null || tags.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .toList();
    }

    public String joinTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return "";
        }
        return String.join(",", tags.stream().map(String::trim).filter(s -> !s.isBlank()).toList());
    }
}
