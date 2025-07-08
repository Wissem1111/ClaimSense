package com.voiceAssistant.internship.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Map;

@FeignClient(name = "assistantClient", url = "http://localhost:8000")
public interface AssistantFeignClient {
    @PostMapping("/run-assistant")
    Map<String, String> runVoiceAssistant();
}
