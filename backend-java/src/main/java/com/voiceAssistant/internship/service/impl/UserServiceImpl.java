package com.voiceAssistant.internship.service.impl;

import com.voiceAssistant.internship.dto.UserDto;
import com.voiceAssistant.internship.model.User;
import com.voiceAssistant.internship.repository.UserRepository;
import com.voiceAssistant.internship.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public UserDto createUser(UserDto dto) {
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setPhone(dto.getPhone());
        user.setDriverLicenseNumber(dto.getDriverLicenseNumber());
        user.setLicenseValidityDate(dto.getLicenseValidityDate());
        user = userRepository.save(user);
        dto.setIdUser(user.getIdUser());
        return dto;
    }

    @Override
    public UserDto getUserByFullNameAndBirth(String fullName, String  dateOfBirth) {
        User user = userRepository.findByFullNameAndDateOfBirth(fullName, dateOfBirth)
                .orElseThrow(() -> new NoSuchElementException("Utilisateur introuvable"));

        return UserDto.builder()
                .idUser(user.getIdUser())
                .fullName(user.getFullName())
                .dateOfBirth(user.getDateOfBirth())
                .phone(user.getPhone())
                .driverLicenseNumber(user.getDriverLicenseNumber())
                .licenseValidityDate(user.getLicenseValidityDate())
                .build();
    }

    public UserDto updateUser(int id, UserDto dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        user.setFullName(dto.getFullName());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setPhone(dto.getPhone());
        user.setDriverLicenseNumber(dto.getDriverLicenseNumber());
        user.setLicenseValidityDate(dto.getLicenseValidityDate());
        return UserDto.toDto(userRepository.save(user));
    }


}
