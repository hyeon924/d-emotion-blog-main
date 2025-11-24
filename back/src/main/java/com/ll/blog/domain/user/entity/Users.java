package com.ll.blog.domain.user.entity;

import com.ll.blog.global.jpa.entity.BaseTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter // 모든 필드의 Getter 메서드 자동생성
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA의 기본 생성자 (접근제한)
@AllArgsConstructor // 전체 필드를 사용하는 생성자 자동 생성
@Builder // 객체 생성 시 builder 패턴 사용 가능
public class Users extends BaseTime {
    @Id // PK 지정 (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL의 AUTO_INCRMENT 방식
    private Long id;

    @Column(nullable = false, unique = true, length = 30) // 중복X, 필수입력, 길이 제한 30
    private String username;

//    닉네임
    @Column(nullable = false, unique = true)
    private String nickname;

    @Setter
    @Column(nullable = false) // 필수 입력
    private String password;

    @Column
    private String role;

}
