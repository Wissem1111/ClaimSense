package com.voiceAssistant.internship.service;

import com.voiceAssistant.internship.dto.DeclarationDto;

import java.util.List;

public interface DeclarationService {
    public DeclarationDto createDeclaration(DeclarationDto dto);
    public List<DeclarationDto> getAllDeclarations();
    public List<DeclarationDto> getDeclarationsByUser(int idUser);
    public DeclarationDto updateDeclaration(int id, DeclarationDto dto);
}
