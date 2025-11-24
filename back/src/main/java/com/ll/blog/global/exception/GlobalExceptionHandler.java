package com.ll.blog.global.exception;

import com.ll.blog.domain.post.exception.PostNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

// 프로젝트 전체에서 발생하는 예외를 공동으로 처리
@RestControllerAdvice // RestControllerAdvice는 @ControllerAdvice와 @ResponseBody를 결합한 것으로, 예외 처리와 JSON 응답을 동시에 지원 / 전역 예외 처리 클래스
public class GlobalExceptionHandler {

//    존재하지 않는 리소스를 요청했을 때 발생하는 예외를 처리
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<GlobalErrorResponse> handleIllegalArgument(IllegalArgumentException e) {
        GlobalErrorResponse response = GlobalErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .message(e.getMessage())
                .build();
        return ResponseEntity.badRequest().body(response);
    }

//    존재하지 않는 id를 수정할때 발생하는 에러 처리
    @ExceptionHandler(PostNotFoundException.class)
    public ResponseEntity<GlobalErrorResponse> handlePostNotFound(PostNotFoundException e) {
        GlobalErrorResponse response = GlobalErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .message(e.getMessage())
                .build();
        return ResponseEntity.badRequest().body(response);
    }

//    그 외 예외처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<GlobalErrorResponse> handleException(Exception e) {
        GlobalErrorResponse response = GlobalErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("서버 내부 오류가 발생했습니다.")
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
