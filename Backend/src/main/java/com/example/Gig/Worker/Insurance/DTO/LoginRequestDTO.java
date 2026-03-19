package com.example.Gig.Worker.Insurance.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {

    private String email;
    private String password;
    private Long phoneNumber;
}