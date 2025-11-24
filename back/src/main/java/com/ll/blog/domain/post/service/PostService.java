package com.ll.blog.domain.post.service;

import com.ll.blog.domain.post.dto.PostRequest;
import com.ll.blog.domain.post.dto.PostResponse;
import com.ll.blog.domain.post.entity.Post;
import com.ll.blog.domain.post.exception.PostNotFoundException;
import com.ll.blog.domain.post.repository.PostRepository;
import com.ll.blog.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;


import java.util.List;
import java.util.stream.Collectors;

// 게시글 비즈니스 로직을 담당
// controller <-> repository 사이의 중간 계층 역할
@Service // 이 클래스가 서비스 컴포넌트임을 Spring에게 알림 (Bean 등록)
@RequiredArgsConstructor // final 필드에 대해 생성자 자동 생성 (의존성주입)
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

//    게시글 생성 (작성자만 가능)
    public PostResponse createAndReturn(PostRequest request, UserDetails userDetails) {
//        username으로 작성자를 식별
        var user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

//        PostRequest로부터 Post 엔티티 생성
        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .emotion(request.getEmotion())
                .author(userDetails.getUsername())
                .user(user) // 작성자 정보 설정
                .build();

        Post saved = postRepository.save(post);
        return PostResponse.from(saved);
    }

//    전체 게시글 조회 (작성자만 가능)
    public List<PostResponse> findAllByUser(UserDetails userDetails) {
        return postRepository.findByAuthor(userDetails.getUsername()).stream()
                .map(PostResponse::from)
                .collect(Collectors.toList());
    }

//    단일 게시글 조회 (작성자만 가능)
    public PostResponse findById(Long id, UserDetails userDetails) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(id));

        if (!post.getAuthor().equals(userDetails.getUsername())) {
            throw new AccessDeniedException("본인의 글만 조회할 수 있습니다.");
        }

        return PostResponse.from(post);
    }

//    게시글 수정 (작성자만 가능)
    @Transactional
    public PostResponse updateAndReturn(Long id, PostRequest request, UserDetails userDetails) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(id));

        if (!post.getAuthor().equals(userDetails.getUsername())) {
            throw new AccessDeniedException("본인의 글만 수정할 수 있습니다.");
        }

        post.update(request.getTitle(), request.getContent(), request.getEmotion());

        return PostResponse.from(post); // 변경 감지로 자동 반영됨!
    }

//    게시글 삭제 (작성자만 가능)
    public void delete(Long id, UserDetails userDetails) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(id));

        if (!post.getAuthor().equals(userDetails.getUsername())) {
            throw new AccessDeniedException("본인의 글만 삭제할 수 있습니다.");
        }

        postRepository.delete(post);
    }

    public String findNickname(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"))
                .getNickname();
    }
}