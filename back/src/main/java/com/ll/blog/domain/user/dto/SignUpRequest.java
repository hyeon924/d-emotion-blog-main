package com.ll.blog.domain.user.dto;

import lombok.Getter;

@Getter
public class SignUpRequest {
    private String username;
    private String nickname;
    private String password;
    private String code; // 이메일 인증 코드
}
