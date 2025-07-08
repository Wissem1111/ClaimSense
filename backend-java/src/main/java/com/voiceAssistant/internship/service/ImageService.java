package com.voiceAssistant.internship.service;

import com.voiceAssistant.internship.dto.ImageDto;

import java.util.List;

public interface ImageService {
    ImageDto saveImage(ImageDto dto);
    List<ImageDto> getImagesByDeclaration(int declarationId);
    public ImageDto updateImage(int id, ImageDto dto);
}
