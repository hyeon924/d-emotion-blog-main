package com.ll.blog.domain.user.controller;

import com.ll.blog.domain.email.service.EmailVerificationService;
import com.ll.blog.domain.user.dto.*;
import com.ll.blog.domain.user.service.UserService;
import com.ll.blog.global.response.StandardApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final EmailVerificationService emailVerificationService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<StandardApiResponse<Void>> signup(@RequestBody SignUpRequest request) {
        try {
            userService.signup(request);
            return ResponseEntity.ok(StandardApiResponse.success("회원가입 완료"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(StandardApiResponse.error(e.getMessage()));
        }
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<StandardApiResponse<String>> login(@RequestBody LoginRequest request) {
        try {
            String token = userService.login(request);
            return ResponseEntity.ok(StandardApiResponse.success("로그인 성공", token));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(StandardApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(StandardApiResponse.error("로그인 중 서버 오류가 발생했습니다."));
        }
    }

    // 탈퇴 인증번호 전송 (로그인 필요)
    @PostMapping("/me/request-verification-code")
    public ResponseEntity<StandardApiResponse<Void>> sendDeleteVerificationCode() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        emailVerificationService.sendVerificationEmail(email);
        return ResponseEntity.ok(StandardApiResponse.success("탈퇴 인증번호 전송 완료"));
    }

    // 비밀번호 변경 (로그인 후)
    @PatchMapping("/me/password")
    public ResponseEntity<StandardApiResponse<Void>> changePassword(
            @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(request);
        return ResponseEntity.ok(StandardApiResponse.success("비밀번호 변경 완료"));
    }

    // 비밀번호 변경 (로그인 전)
    @PostMapping("/reset-password")
    public ResponseEntity<StandardApiResponse<Void>> resetPassword(
            @RequestParam String username,
            @RequestParam String code,
            @RequestParam String newPassword
    ) {
        try {
            boolean verified = emailVerificationService.verifyCode(username, code);
            if (!verified) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(StandardApiResponse.error("인증 실패: 잘못된 코드이거나 만료되었습니다."));
            }

            userService.resetPassword(username, newPassword);
            return ResponseEntity.ok(StandardApiResponse.success("비밀번호가 변경되었습니다."));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(StandardApiResponse.error(e.getMessage()));
        }
    }

    // 회원 탈퇴
    @DeleteMapping("/me")
    public ResponseEntity<StandardApiResponse<Void>> deleteUser(@RequestBody DeleteUserRequest request) {
        userService.deleteCurrentUser(request.getCode());
        return ResponseEntity.ok(StandardApiResponse.success("회원 탈퇴가 완료되었습니다."));
    }
}
