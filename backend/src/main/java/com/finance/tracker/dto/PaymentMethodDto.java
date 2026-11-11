package com.finance.tracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PaymentMethodDto {
    private Long id;

    @NotBlank(message = "Payment method name is required")
    @Size(max = 50, message = "Name must not exceed 50 characters")
    private String name;

    public PaymentMethodDto() {}

    public PaymentMethodDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

