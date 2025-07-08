package com.voiceAssistant.internship.repository;

import com.voiceAssistant.internship.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ImageRepository extends JpaRepository<Image, Integer> {
    List<Image> findByDeclaration_IdDeclaration(int idDeclaration);
}
