package com.edulib.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class HistoryCreateRequest {

    @NotBlank
    private String resourceId;

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }
}
