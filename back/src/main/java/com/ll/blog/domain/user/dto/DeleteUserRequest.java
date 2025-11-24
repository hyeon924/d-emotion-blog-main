package com.ll.blog.domain.user.dto;

import lombok.Getter;

@Getter
public class DeleteUserRequest {
    private String code; // 이메일 인증 코드
}
