package com.voiceAssistant.internship.controller;

import com.voiceAssistant.internship.service.impl.AssistantTriggerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
public class AssistantController {


    private final AssistantTriggerService triggerService;

     /*
    @PostMapping("/start")
    public ResponseEntity<String> startConversation(
            @RequestParam String fullName,
            @RequestParam String dateOfBirth) {
        return ResponseEntity.ok(assistantService.startConversation(fullName, dateOfBirth));
    }*/


        @PostMapping("/start")
        public ResponseEntity<String> startAssistant() {
            String message = triggerService.runAssistant();
            return ResponseEntity.ok(message);
        }

}

