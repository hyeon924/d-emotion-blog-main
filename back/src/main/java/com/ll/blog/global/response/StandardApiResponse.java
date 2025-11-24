package com.ll.blog.global.response;

import lombok.Builder;
import lombok.Getter;

// 모든 API 응답을 통일된 형식으로 감싸기 위한 클래스
@Getter
@Builder
public class StandardApiResponse<T> {
    private int status;
    private String message;
    private T data;

    // 성공 응답
    public static <T> StandardApiResponse<T> success(String message, T data) {
        return StandardApiResponse.<T>builder()
                .status(200)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> StandardApiResponse<T> success(T data) {
        return success("성공", data);
    }

    public static StandardApiResponse<Void> success(String message) {
        return success(message, null);
    }

    // ✅ 오류 응답 (정적 메서드만 남기고 인스턴스 메서드는 제거!)
    public static <T> StandardApiResponse<T> error(String message) {
        return StandardApiResponse.<T>builder()
                .status(400)
                .message(message)
                .data(null)
                .build();
    }

    public static <T> StandardApiResponse<T> error(int status, String message) {
        return StandardApiResponse.<T>builder()
                .status(status)
                .message(message)
                .data(null)
                .build();
    }
}
