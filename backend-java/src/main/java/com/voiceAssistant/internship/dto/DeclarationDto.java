package com.voiceAssistant.internship.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.voiceAssistant.internship.model.Declaration;
import com.voiceAssistant.internship.model.Image;
import com.voiceAssistant.internship.model.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeclarationDto {

    private int idDeclaration;

    @NotNull
    private Date incidentDate;

    @NotBlank(message = "L'heure de l'incident est obligatoire")
    private String incidentTime;

    @NotBlank(message = "Lieu d'incident est obligatoire")
    private String incidentLocation;

    @NotBlank(message = "Immatriculation est obligatoire")
    private String vehicleRegistration;

    @NotBlank(message = "Marque est obligatoire")
    private String vehicleBrand;

    private String incidentType;
    private String incidentDetails;

    private String impactPoint;
    private String circumstances;

    private boolean amicableReport;
    private boolean policeReport;
    private boolean policeReceipt;
    private boolean insuredDeclaration;
    private boolean calledAssistance;
    private boolean calledTowTruck;

    private String engagement;
    private String status;


    private int idUser;


    private List<Image> imageList;

    public static Declaration toEntity(DeclarationDto declarationDto) {
        Declaration declaration = new Declaration();
        declaration.setIdDeclaration(declarationDto.getIdDeclaration());
        declaration.setIncidentDate(declarationDto.getIncidentDate());
        declaration.setIncidentTime(declarationDto.getIncidentTime());
        declaration.setIncidentLocation(declarationDto.getIncidentLocation());
        declaration.setVehicleRegistration(declarationDto.getVehicleRegistration());
        declaration.setVehicleBrand(declarationDto.getVehicleBrand());
        declaration.setIncidentType(declarationDto.getIncidentType());
        declaration.setIncidentDetails(declarationDto.getIncidentDetails());
        declaration.setImpactPoint(declarationDto.getImpactPoint());
        declaration.setCircumstances(declarationDto.getCircumstances());

        declaration.setAmicableReport(declarationDto.isAmicableReport());
        declaration.setPoliceReport(declarationDto.isPoliceReport());
        declaration.setPoliceReceipt(declarationDto.isPoliceReceipt());
        declaration.setInsuredDeclaration(declarationDto.isInsuredDeclaration());
        declaration.setCalledAssistance(declarationDto.isCalledAssistance());
        declaration.setCalledTowTruck(declarationDto.isCalledTowTruck());

        declaration.setEngagement(declarationDto.getEngagement());
        declaration.setStatus(declarationDto.getStatus());
        declaration.setImageList(declarationDto.getImageList());

        return declaration;
    }

    public  static  DeclarationDto toDto(Declaration declaration){
        return DeclarationDto.builder()
                .idDeclaration(declaration.getIdDeclaration())
                .incidentDate(declaration.getIncidentDate())
                .incidentTime(declaration.getIncidentTime())
                .incidentLocation(declaration.getIncidentLocation())
                .vehicleRegistration(declaration.getVehicleRegistration())
                .vehicleBrand(declaration.getVehicleBrand())
                .incidentType(declaration.getIncidentType())
                .incidentDetails(declaration.getIncidentDetails())
                .impactPoint(declaration.getImpactPoint())
                .circumstances(declaration.getCircumstances())

                .amicableReport(declaration.isAmicableReport())
                .policeReport(declaration.isPoliceReport())
                .policeReceipt(declaration.isPoliceReceipt())
                .insuredDeclaration(declaration.isInsuredDeclaration())
                .calledAssistance(declaration.isCalledAssistance())
                .calledTowTruck(declaration.isCalledTowTruck())

                .engagement(declaration.getEngagement())
                .status(declaration.getStatus())
                .idUser(declaration.getUser().getIdUser())
                .imageList(declaration.getImageList())
                .build();
    }
}

