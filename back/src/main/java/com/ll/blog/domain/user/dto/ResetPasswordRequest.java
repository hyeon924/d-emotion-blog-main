package com.ll.blog.domain.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    private String username;
    private String code;
    private String newPassword;

}
