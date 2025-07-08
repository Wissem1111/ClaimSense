package com.voiceAssistant.internship.service.impl;

import com.voiceAssistant.internship.client.AssistantFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AssistantTriggerService {


    private final AssistantFeignClient assistantFeignClient;
    public String runAssistant() {
        Map<String, String> result = assistantFeignClient.runVoiceAssistant();
        return result.get("message");
    }

}

