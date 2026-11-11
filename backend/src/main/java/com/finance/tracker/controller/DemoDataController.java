package com.finance.tracker.controller;

import com.finance.tracker.service.DemoDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/demo")
public class DemoDataController {

    private final DemoDataService demoDataService;

    public DemoDataController(DemoDataService demoDataService) {
        this.demoDataService = demoDataService;
    }

    @PostMapping("/populate")
    public ResponseEntity<Map<String, String>> populateDemoData() {
        demoDataService.populateMockData();
        return ResponseEntity.ok(Map.of("message", "Demo data populated successfully"));
    }

    @PostMapping("/clear")
    public ResponseEntity<Map<String, String>> clearDemoData() {
        demoDataService.clearAllTransactions();
        return ResponseEntity.ok(Map.of("message", "All transactions cleared successfully"));
    }
}

