package com.ll.blog.domain.email.dto;

import lombok.Getter;

@Getter
public class EmailVerificationRequest {
    private String email;
    private String code;

}
