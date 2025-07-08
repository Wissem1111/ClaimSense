package com.voiceAssistant.internship.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Declaration {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idDeclaration;

    private Date incidentDate;
    private String incidentTime;
    private String incidentLocation;
    private String vehicleRegistration;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @OneToMany
    private List<Image> imageList;

}

