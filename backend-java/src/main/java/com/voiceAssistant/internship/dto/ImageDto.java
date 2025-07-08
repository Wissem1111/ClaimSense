package com.voiceAssistant.internship.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.voiceAssistant.internship.model.Declaration;
import com.voiceAssistant.internship.model.Image;
import com.voiceAssistant.internship.model.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.aspectj.weaver.SimpleAnnotationValue;

import java.time.LocalDate;
import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImageDto {

    private int idImg;

    @NotNull(message = "Date d'envoi est obligatoire")
    private LocalDate uploadDate;

    @NotBlank(message = "Le contenu d'image est obligatoire")
    private String imgContent;

    @JsonIgnore
    private Declaration declaration;


    public static Image toEntity(ImageDto imageDto) {

        Image image = new Image();
        image.setIdImg(imageDto.getIdImg());
        image.setUploadDate(imageDto.getUploadDate());
        image.setImgContent(imageDto.getImgContent());
        image.setDeclaration(imageDto.getDeclaration());
        return image;
    }

    public static ImageDto toDto(Image image) {
        return ImageDto.builder()
                .idImg(image.getIdImg())
                .uploadDate(image.getUploadDate())
                .imgContent(image.getImgContent())
                .declaration(image.getDeclaration())
                .build();
    }

}