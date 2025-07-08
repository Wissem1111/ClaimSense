package com.voiceAssistant.internship.service;

import com.voiceAssistant.internship.dto.UserDto;


public interface UserService {
    UserDto createUser(UserDto dto);
    UserDto getUserByFullNameAndBirth(String fullName, String  dateOfBirth);
    public UserDto updateUser(int id, UserDto dto);
}

