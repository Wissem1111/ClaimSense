package com.voiceAssistant.internship.controller;


import com.voiceAssistant.internship.dto.DeclarationDto;
import com.voiceAssistant.internship.service.DeclarationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/declarations")
@RequiredArgsConstructor
public class DeclarationController {
    private final DeclarationService declarationService;

    @PostMapping
    public ResponseEntity<DeclarationDto> create(@Valid @RequestBody DeclarationDto dto) {
        if (dto.getIdUser()== 0){
            throw new IllegalArgumentException("Utilisateur manquant dans la déclaration");
        }
        return ResponseEntity.ok(declarationService.createDeclaration(dto));
    }

    @GetMapping
    public ResponseEntity<List<DeclarationDto>> getAll() {
        return ResponseEntity.ok(declarationService.getAllDeclarations());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeclarationDto> updateDeclaration(@PathVariable int id, @RequestBody DeclarationDto dto) {
        return ResponseEntity.ok(declarationService.updateDeclaration(id, dto));
    }



    /*@PostMapping("/vocal")
    public ResponseEntity<DeclarationDto> receiveFromPython(@Valid @RequestBody DeclarationDto dto, HttpServletRequest request) {
        log.info("Received from Python: {}", dto);
        log.info("Content-Type received: {}", request.getContentType());

        DeclarationDto result = declarationService.createDeclaration(dto);
        if (result == null) {
            return ResponseEntity.internalServerError().build();
        }
        log.info("Returning to Python: {}", result);
        return ResponseEntity.ok(result);
    }*/


    @PostMapping("/vocal")
    public ResponseEntity<DeclarationDto> receiveFromPython(@Valid @RequestBody DeclarationDto dto, HttpServletRequest request) {
        System.out.println("Reçu depuis Python : " + dto);
        System.out.println("Content-Type reçu: " + request.getContentType());

        DeclarationDto result = declarationService.createDeclaration(dto);
        System.out.println("Retour à Python : " + result);

        if (result == null) {
            return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.ok(result);
    }


    @GetMapping("/user/{idUser}")
    public ResponseEntity<List<DeclarationDto>> getDeclarationsByUser(@PathVariable int idUser) {
        return ResponseEntity.ok(declarationService.getDeclarationsByUser(idUser));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DeclarationDto> updateStatus(
            @PathVariable int id,
            @RequestParam String newStatus) {
        try {
            DeclarationDto updated = declarationService.updateStatus(id, newStatus);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }




//ce pour recevoir les données JSON que Python envoie.
}