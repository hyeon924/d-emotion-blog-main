package com.ll.blog.domain.my.dto;

import com.ll.blog.domain.post.entity.Post;
import lombok.Getter;

@Getter
public class PostSimpleDto {
    private Long id;
    private String title;

    public PostSimpleDto(Long id, String title) {
        this.id = id;
        this.title = title;
    }

    public static PostSimpleDto from(Post post) {
        return new PostSimpleDto(post.getId(), post.getTitle());
    }
}
