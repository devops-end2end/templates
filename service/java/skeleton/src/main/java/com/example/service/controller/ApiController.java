package com.example.service.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ApiController {

    @Value("${spring.application.name}")
    private String appName;

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> index() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to " + appName);
        response.put("status", "healthy");
        response.put("docs_url", "/docs");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
