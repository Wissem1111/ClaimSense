package com.voiceAssistant.internship.repository;

import com.voiceAssistant.internship.model.Declaration;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DeclarationRepository extends JpaRepository<Declaration, Integer> {
}
