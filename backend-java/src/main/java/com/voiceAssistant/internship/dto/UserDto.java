package com.voiceAssistant.internship.dto;



import com.fasterxml.jackson.annotation.JsonIgnore;
import com.voiceAssistant.internship.model.Declaration;
import com.voiceAssistant.internship.model.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {

    private int idUser;

    @NotBlank(message = "Nom complet est obligatoire")
    private String fullName;

    private String  dateOfBirth;

    @NotBlank(message = "Telephone est obligatoire")
    @Size(min = 8, max = 8, message = "Le numéro doit contenir 8 chiffres")
    private String phone;

    @NotBlank(message = "Numero de permis est obligatoire")
    private String driverLicenseNumber;

    @NotBlank(message = "Date de validite est obligatoire")
    private String licenseValidityDate;

        @JsonIgnore
    private List<Declaration> declarationList;


    public static User toEntity(UserDto userdto) {
        User user = new User();
        user.setIdUser(userdto.getIdUser());
        user.setFullName(userdto.getFullName());
        user.setDateOfBirth(userdto.getDateOfBirth());
        user.setPhone(userdto.getPhone());
        user.setLicenseValidityDate(userdto.getLicenseValidityDate());
        user.setDeclarationList(userdto.getDeclarationList());
        return user;
    }

    public static UserDto toDto(User user) {
        return UserDto.builder()
                .idUser(user.getIdUser())
                .fullName(user.getFullName())
                .dateOfBirth(user.getDateOfBirth())
                .phone(user.getPhone())
                .driverLicenseNumber(user.getDriverLicenseNumber())
                .licenseValidityDate(user.getLicenseValidityDate())
                .declarationList(user.getDeclarationList())
                .build();
    }
}