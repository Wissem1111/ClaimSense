package com.voiceAssistant.internship.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idImg;

    private LocalDate uploadDate;

    @Basic(fetch = FetchType.EAGER)
    private String imgContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="declaration_id")
    private Declaration declaration;
}
