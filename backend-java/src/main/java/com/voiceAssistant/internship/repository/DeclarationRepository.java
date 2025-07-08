package com.voiceAssistant.internship.repository;

import com.voiceAssistant.internship.model.Declaration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface DeclarationRepository extends JpaRepository<Declaration, Integer> {
 List<Declaration> findByUserIdUser(int idUser);

}
