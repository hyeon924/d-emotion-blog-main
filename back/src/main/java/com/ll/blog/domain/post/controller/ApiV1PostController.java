package com.ll.blog.domain.post.controller;

import com.ll.blog.domain.post.dto.PostListWithNicknameResponse;
import com.ll.blog.domain.post.dto.PostRequest;
import com.ll.blog.domain.post.dto.PostResponse;
import com.ll.blog.domain.post.service.PostService;
import com.ll.blog.global.response.StandardApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 게시글 관련 API를 처리하는 REST 컨트롤러
// URL : /api/v1/posts
@RestController // REST API 전용 컨트롤러 (JSON 응답)
@RequestMapping("/api/v1/posts") // 해당 컨드롤러의 기본 url
@RequiredArgsConstructor // 의존성 주입 위한 생성자 자동 생성
public class ApiV1PostController {
    private final PostService postService;

//    게시글 생성
    @PostMapping
    public ResponseEntity<StandardApiResponse<PostResponse>> createPost(@RequestBody PostRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        PostResponse response = postService.createAndReturn(request, userDetails);
        return ResponseEntity.ok(StandardApiResponse.success("글이 작성되었습니다.", response));
    }

//    (전체) 게시글 조회
    @GetMapping
    public ResponseEntity<StandardApiResponse<PostListWithNicknameResponse>> getAllPost(@AuthenticationPrincipal UserDetails userDetails) {
        List<PostResponse> posts = postService.findAllByUser(userDetails);
        String nickname = postService.findNickname(userDetails);
        PostListWithNicknameResponse result = new PostListWithNicknameResponse(nickname, posts);
        return ResponseEntity.ok(StandardApiResponse.success(result));
    }

//    (단일) 게시글 조회
    @GetMapping("/{id}")
    public ResponseEntity<StandardApiResponse<PostResponse>> getPost(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(StandardApiResponse.success(postService.findById(id, userDetails)));
    }

//    게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<StandardApiResponse<PostResponse>> updatePost(@PathVariable Long id, @RequestBody PostRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        PostResponse response = postService.updateAndReturn(id, request, userDetails);
        return ResponseEntity.ok(StandardApiResponse.success("글이 수정되었습니다.", response));
    }

//    게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardApiResponse<Void>> deletePost(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        postService.delete(id, userDetails);
        String message = id + "번 게시글이 삭제되었습니다.";
        return ResponseEntity.ok(StandardApiResponse.success(message));
    }
}
