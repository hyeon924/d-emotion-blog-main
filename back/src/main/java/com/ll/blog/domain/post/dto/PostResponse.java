package com.ll.blog.domain.post.dto;


import com.ll.blog.domain.post.entity.Post;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

// 게시글 조회 응답 DTO
@Getter
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String emotion;
    private LocalDateTime createDate;
    private LocalDateTime modifyDate;

//    정적 펙토리 메서드
    public static PostResponse from(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .emotion(post.getEmotion())
                .createDate(post.getCreateDate())
                .modifyDate(post.getModifyDate())
                .build();
    }
}
