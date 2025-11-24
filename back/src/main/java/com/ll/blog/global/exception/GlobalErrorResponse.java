package com.ll.blog.global.exception;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

// 예외 발생 시 사용자에게 전달 할 에러 응답 객체
@Getter
@Builder
public class GlobalErrorResponse {
    private LocalDateTime timestamp; // 에러 발생 시간
    private int status; // HTTP 상태 코드
    private String message; // 에러 메시지
}
