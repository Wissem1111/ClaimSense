package com.voiceAssistant.internship.model;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "app_user")

public class User {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idUser;

    private String fullName;
    private String dateOfBirth;
    private String phone;

    @Column(unique = true)
    private String driverLicenseNumber;
    private String licenseValidityDate;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Declaration> declarationList;
}