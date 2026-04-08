package com.edulib.backend.config;

import com.edulib.backend.model.AppUser;
import com.edulib.backend.model.Resource;
import com.edulib.backend.model.Review;
import com.edulib.backend.repository.AppUserRepository;
import com.edulib.backend.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AppUserRepository appUserRepository;
    private final ResourceRepository resourceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(AppUserRepository appUserRepository,
                      ResourceRepository resourceRepository,
                      PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.resourceRepository = resourceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedResources();
    }

    private void seedUsers() {
        if (appUserRepository.count() > 0) {
            return;
        }

        AppUser admin = new AppUser();
        admin.setEmail("admin@edulib.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("admin");
        admin.setStatus("active");
        admin.setJoinedAt(Instant.parse("2023-01-01T00:00:00Z"));

        AppUser student = new AppUser();
        student.setEmail("student@test.com");
        student.setPassword(passwordEncoder.encode("student123"));
        student.setRole("user");
        student.setStatus("active");
        student.setJoinedAt(Instant.parse("2023-11-15T00:00:00Z"));

        AppUser suspended = new AppUser();
        suspended.setEmail("jane.doe@example.com");
        suspended.setPassword(passwordEncoder.encode("jane123"));
        suspended.setRole("user");
        suspended.setStatus("suspended");
        suspended.setJoinedAt(Instant.parse("2023-12-01T00:00:00Z"));

        appUserRepository.save(admin);
        appUserRepository.save(student);
        appUserRepository.save(suspended);
    }

    private void seedResources() {
        if (resourceRepository.count() > 0) {
            return;
        }

        Resource r1 = new Resource();
        r1.setId("1");
        r1.setTitle("Introduction to Quantum Computing");
        r1.setDescription("A comprehensive guide to the fundamentals of quantum mechanics and its application in computing.");
        r1.setAuthor("Dr. Sarah Chen");
        r1.setCategory("Science");
        r1.setSubject("Physics");
        r1.setFileType("PDF");
        r1.setTags("Quantum,Computing,Physics");
        r1.setDownloadCount(1240);
        r1.setRating(4.8);
        r1.setFeatured(true);
        r1.setCreatedAt(Instant.parse("2023-10-15T10:00:00Z"));
        r1.setReviews(new ArrayList<>());

        Review review = new Review();
        review.setId("r1");
        review.setUserId("u1");
        review.setUserName("John Doe");
        review.setRating(5);
        review.setComment("Excellent resource!");
        review.setDate(Instant.parse("2023-11-01T00:00:00Z"));
        review.setResource(r1);
        r1.getReviews().add(review);

        Resource r2 = new Resource();
        r2.setId("2");
        r2.setTitle("Modern Web Architectures");
        r2.setDescription("Exploring microservices, serverless, and edge computing in the modern web era.");
        r2.setAuthor("Alex Rivera");
        r2.setCategory("Technology");
        r2.setSubject("Computer Science");
        r2.setFileType("Epub");
        r2.setTags("Web,Architecture,Backend");
        r2.setDownloadCount(850);
        r2.setRating(4.5);
        r2.setFeatured(true);
        r2.setCreatedAt(Instant.parse("2023-11-20T14:30:00Z"));

        Resource r3 = new Resource();
        r3.setId("3");
        r3.setTitle("The Art of Renaissance");
        r3.setDescription("A visual journey through the most influential art period in human history.");
        r3.setAuthor("Elena Moretti");
        r3.setCategory("Arts");
        r3.setSubject("History");
        r3.setFileType("Video");
        r3.setTags("Art,History,Renaissance");
        r3.setDownloadCount(420);
        r3.setRating(4.9);
        r3.setFeatured(false);
        r3.setCreatedAt(Instant.parse("2023-12-05T09:15:00Z"));

        Resource r4 = new Resource();
        r4.setId("4");
        r4.setTitle("Advanced Calculus Vol. 1");
        r4.setDescription("Deep dive into multivariate calculus and differential equations.");
        r4.setAuthor("Prof. Michael Vogt");
        r4.setCategory("Mathematics");
        r4.setSubject("Calculus");
        r4.setFileType("PDF");
        r4.setTags("Math,Calculus,Advanced");
        r4.setDownloadCount(2100);
        r4.setRating(4.7);
        r4.setFeatured(true);
        r4.setCreatedAt(Instant.parse("2023-09-10T08:00:00Z"));

        resourceRepository.save(r1);
        resourceRepository.save(r2);
        resourceRepository.save(r3);
        resourceRepository.save(r4);
    }
}
