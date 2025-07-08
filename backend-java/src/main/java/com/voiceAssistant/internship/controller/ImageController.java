package com.voiceAssistant.internship.controller;

import com.voiceAssistant.internship.dto.ImageDto;
import com.voiceAssistant.internship.model.Declaration;
import com.voiceAssistant.internship.service.ImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

   /* @PostMapping
    public ResponseEntity<ImageDto> upload(@Valid @RequestBody ImageDto dto, @RequestParam("file") MultipartFile file) throws IOException  {
        return ResponseEntity.ok(imageService.saveImage(dto));
    }*/

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageDto> uploadImage(@RequestParam("file") MultipartFile file,@RequestParam("uploadDate")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate uploadDate, @RequestParam("declarationId")
    int declarationId) throws IOException {
        String base64Image = Base64.getEncoder().encodeToString(file.getBytes());

        ImageDto dto = new ImageDto();
        dto.setUploadDate(uploadDate);
        dto.setImgContent(base64Image);

        Declaration declaration = new Declaration();
        declaration.setIdDeclaration(declarationId);
        dto.setDeclaration(declaration);

        return ResponseEntity.ok(imageService.saveImage(dto));
    }






    @GetMapping
    public ResponseEntity<List<ImageDto>> getByDeclaration(@Valid @RequestParam int declarationId) {
        return ResponseEntity.ok(imageService.getImagesByDeclaration(declarationId));
    }


    @PutMapping("/{id}")
    public ResponseEntity<ImageDto> updateImage(@PathVariable int id, @RequestBody ImageDto dto) {
        return ResponseEntity.ok(imageService.updateImage(id, dto));
    }

}