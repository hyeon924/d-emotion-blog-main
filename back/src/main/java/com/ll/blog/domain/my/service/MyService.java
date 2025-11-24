package com.ll.blog.domain.my.service;

import com.ll.blog.domain.my.dto.MyPageResponse;
import com.ll.blog.domain.post.repository.PostRepository;
import com.ll.blog.domain.user.entity.Users;
import com.ll.blog.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public MyPageResponse getMyPage(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        int postCount = postRepository.countByUser(user); // ✅ 리스트 대신 개수만 가져옴

        return MyPageResponse.of(user, postCount);
    }
}
