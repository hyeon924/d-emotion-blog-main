package com.ll.blog.domain.email.controller;

import com.ll.blog.domain.email.dto.EmailVerificationRequest;
import com.ll.blog.domain.email.service.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

//    인증번호 요청
    @PostMapping("/request-verification-code")
    public ResponseEntity<?> requestCode(@RequestParam String email) {
        emailVerificationService.sendVerificationEmail(email);
        return ResponseEntity.ok("인증번호 전송 완료");
    }

//    인증번호 확인
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody EmailVerificationRequest request) {
        boolean success = emailVerificationService.verifyCode(request.getEmail(), request.getCode());
        if (success) {
            return ResponseEntity.ok("인증 성공");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증 실패: 잘못된 코드이거나 만료되었습니다.");
        }
    }

 }
