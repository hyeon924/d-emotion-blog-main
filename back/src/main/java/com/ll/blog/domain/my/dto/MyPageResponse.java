package com.ll.blog.domain.my.dto;

import com.ll.blog.domain.user.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MyPageResponse {
    private String nickname;
    private int postCount;

    public static MyPageResponse of(Users user, int postCount) {
        return new MyPageResponse(user.getNickname(), postCount);
    }
}
