package com.ll.blog.domain.post.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PostListWithNicknameResponse {
    private String nickname;
    private List<PostResponse> posts;
}
