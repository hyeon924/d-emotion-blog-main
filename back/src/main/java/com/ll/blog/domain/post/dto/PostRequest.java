package com.ll.blog.domain.post.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

// 게시글 생성/수정 요청을 위한 DTO
@Getter
@NoArgsConstructor
public class PostRequest {
    private String title;
    private String content;
    private String emotion;
}
