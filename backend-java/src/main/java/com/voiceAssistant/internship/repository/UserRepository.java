package com.voiceAssistant.internship.repository;

import com.voiceAssistant.internship.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByFullNameAndDateOfBirth(String fullName, String  dateOfBirth);
}
