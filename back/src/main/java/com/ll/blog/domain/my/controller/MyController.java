package com.ll.blog.domain.my.controller;

import com.ll.blog.domain.my.dto.MyPageResponse;
import com.ll.blog.domain.my.service.MyService;
import com.ll.blog.global.response.StandardApiResponse;
import com.ll.blog.global.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/my")
@RequiredArgsConstructor
public class MyController {
    private final MyService myService;

    @GetMapping
    public ResponseEntity<StandardApiResponse<MyPageResponse>> getMyPage(@AuthenticationPrincipal CustomUserDetails userDetails) {
        MyPageResponse response = myService.getMyPage(userDetails.getUsername());
        return ResponseEntity.ok(StandardApiResponse.success(response));
    }
}

