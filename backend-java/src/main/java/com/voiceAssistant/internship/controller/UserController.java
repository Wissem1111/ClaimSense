package com.voiceAssistant.internship.controller;

import com.voiceAssistant.internship.dto.UserDto;
import com.voiceAssistant.internship.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto dto) {
        return ResponseEntity.ok(userService.createUser(dto));
    }

    @GetMapping("/search")
    public ResponseEntity<UserDto> searchUser(@Valid @RequestParam String fullName, @RequestParam String  dateOfBirth){
        return ResponseEntity.ok(userService.getUserByFullNameAndBirth(fullName, dateOfBirth));
    }


    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable int id, @RequestBody UserDto dto) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }



}
