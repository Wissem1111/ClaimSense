package com.voiceAssistant.internship.service.impl;


import com.voiceAssistant.internship.dto.DeclarationDto;
import com.voiceAssistant.internship.model.Declaration;
import com.voiceAssistant.internship.model.User;
import com.voiceAssistant.internship.repository.DeclarationRepository;
import com.voiceAssistant.internship.repository.UserRepository;
import com.voiceAssistant.internship.service.DeclarationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class DeclarationServiceImpl implements DeclarationService {
    private final DeclarationRepository declarationRepository;
    private final UserRepository userRepository;

    @Override
    public DeclarationDto createDeclaration(DeclarationDto dto) {
        User user = userRepository.findById(dto.getIdUser()).orElseThrow(()-> new RuntimeException("User not found"));
        Declaration declaration = new Declaration();
        declaration.setIncidentDate(dto.getIncidentDate());
        declaration.setIncidentTime(dto.getIncidentTime());
        declaration.setIncidentLocation(dto.getIncidentLocation());
        declaration.setVehicleRegistration(dto.getVehicleRegistration());
        declaration.setVehicleBrand(dto.getVehicleBrand());
        declaration.setIncidentType(dto.getIncidentType());
        declaration.setIncidentDetails(dto.getIncidentDetails());
        declaration.setImpactPoint(dto.getImpactPoint());
        declaration.setCircumstances(dto.getCircumstances());
        declaration.setAmicableReport(dto.isAmicableReport());
        declaration.setPoliceReport(dto.isPoliceReport());
        declaration.setPoliceReceipt(dto.isPoliceReceipt());
        declaration.setInsuredDeclaration(dto.isInsuredDeclaration());
        declaration.setCalledAssistance(dto.isCalledAssistance());
        declaration.setCalledTowTruck(dto.isCalledTowTruck());
        declaration.setEngagement(dto.getEngagement());

        String initialStatus = (dto.getStatus() == null || dto.getStatus().isBlank()) ? "en attente" : dto.getStatus();
        declaration.setStatus(initialStatus);

        //declaration.setStatus(dto.getStatus());
        declaration.setUser(user);
        Declaration saved = declarationRepository.save(declaration);
        log.info(" Saved declaration: {}", saved);
        dto.setIdDeclaration(saved.getIdDeclaration());
        return dto;
    }

    @Override
    public List<DeclarationDto> getAllDeclarations() {
        return declarationRepository.findAll().stream()
                .map(d -> DeclarationDto.builder()
                        .idDeclaration(d.getIdDeclaration())
                        .incidentDate(d.getIncidentDate())
                        .incidentTime(d.getIncidentTime())
                        .incidentLocation(d.getIncidentLocation())
                        .vehicleRegistration(d.getVehicleRegistration())
                        .vehicleBrand(d.getVehicleBrand())
                        .incidentType(d.getIncidentType())
                        .incidentDetails(d.getIncidentDetails())
                        .impactPoint(d.getImpactPoint())
                        .circumstances(d.getCircumstances())
                        .amicableReport(d.isAmicableReport())
                        .policeReport(d.isPoliceReport())
                        .policeReceipt(d.isPoliceReceipt())
                        .insuredDeclaration(d.isInsuredDeclaration())
                        .calledAssistance(d.isCalledAssistance())
                        .calledTowTruck(d.isCalledTowTruck())
                        .engagement(d.getEngagement())
                        .status(d.getStatus())
                        .idUser(d.getUser().getIdUser())
                        .build())
                .collect(Collectors.toList());
    }



    public List<DeclarationDto> getDeclarationsByUser(int idUser) {
        return declarationRepository.findByUserIdUser(idUser)
                .stream()
                .map(DeclarationDto::toDto)
                .collect(Collectors.toList());
    }


    public DeclarationDto updateDeclaration(int id, DeclarationDto dto) {
        Declaration declaration = declarationRepository.findById(id).orElseThrow(() -> new RuntimeException("Déclaration introuvable"));
        declaration.setIncidentDate(dto.getIncidentDate());
        declaration.setIncidentTime(dto.getIncidentTime());
        declaration.setIncidentLocation(dto.getIncidentLocation());
        declaration.setVehicleRegistration(dto.getVehicleRegistration());
        declaration.setVehicleBrand(dto.getVehicleBrand());
        declaration.setIncidentType(dto.getIncidentType());
        declaration.setIncidentDetails(dto.getIncidentDetails());
        declaration.setImpactPoint(dto.getImpactPoint());
        declaration.setCircumstances(dto.getCircumstances());
        declaration.setAmicableReport(dto.isAmicableReport());
        declaration.setPoliceReport(dto.isPoliceReport());
        declaration.setPoliceReceipt(dto.isPoliceReceipt());
        declaration.setInsuredDeclaration(dto.isInsuredDeclaration());
        declaration.setCalledAssistance(dto.isCalledAssistance());
        declaration.setCalledTowTruck(dto.isCalledTowTruck());
        declaration.setEngagement(dto.getEngagement());
        declaration.setStatus(dto.getStatus());
        return DeclarationDto.toDto(declarationRepository.save(declaration));
    }

    @Override
    public DeclarationDto updateStatus(int id, String newStatus) {
        Declaration declaration = declarationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Déclaration introuvable"));

        String currentStatus = declaration.getStatus();
        if (currentStatus.equals("en_attente") && newStatus.equals("en_cours")) {
            declaration.setStatus("en_cours");
        } else if (currentStatus.equals("en_cours") &&
                (newStatus.equals("validée") || newStatus.equals("refusée"))) {
            declaration.setStatus(newStatus);
        } else {
            throw new RuntimeException("Transition de statut non autorisée !");
        }

        return DeclarationDto.toDto(declarationRepository.save(declaration));
    }

}
