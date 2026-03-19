package com.example.Gig.Worker.Insurance.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkerRequestDTO {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String city;

    @NotNull
    private Long phoneNumber;

    @NotNull
    private Double avgIncome;

    @NotBlank
    private String platform;   // "ZOMATO","SWIGGY","AMAZON","ZEPTO","BLINKIT" etc.

    @NotBlank
    private String password;

    // role — defaults to "WORKER" if not provided
    private String role;
}