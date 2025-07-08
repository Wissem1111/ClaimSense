package com.voiceAssistant.internship.service.impl;


import com.voiceAssistant.internship.dto.ImageDto;
import com.voiceAssistant.internship.model.Declaration;
import com.voiceAssistant.internship.model.Image;
import com.voiceAssistant.internship.repository.DeclarationRepository;
import com.voiceAssistant.internship.repository.ImageRepository;
import com.voiceAssistant.internship.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final ImageRepository imageRepository;
    private final DeclarationRepository declarationRepository;

    @Override
    public ImageDto saveImage(ImageDto dto) {
        Declaration declaration = declarationRepository.findById(dto.getDeclaration().getIdDeclaration()).orElseThrow();
        Image image = new Image();
        image.setUploadDate(dto.getUploadDate());
        image.setImgContent(dto.getImgContent());
        image.setDeclaration(declaration);
        image = imageRepository.save(image);
        dto.setIdImg(image.getIdImg());
        return dto;
    }

    @Override
    public List<ImageDto> getImagesByDeclaration(int declaration_Id) {
        return imageRepository.findByDeclaration_IdDeclaration(declaration_Id).stream()
                .map(img -> ImageDto.builder()
                        .idImg(img.getIdImg())
                        .uploadDate(img.getUploadDate())
                        .imgContent(img.getImgContent())
                        .declaration(img.getDeclaration())
                        .build())
                .collect(Collectors.toList());
    }



    public ImageDto updateImage(int id, ImageDto dto) {
        Image image = imageRepository.findById(id).orElseThrow(() -> new RuntimeException("Image introuvable"));
        image.setUploadDate(dto.getUploadDate());
        image.setImgContent(dto.getImgContent());
        return ImageDto.toDto(imageRepository.save(image));
    }

}
