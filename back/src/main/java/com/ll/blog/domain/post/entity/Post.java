package com.ll.blog.domain.post.entity;

import com.ll.blog.domain.user.entity.Users;
import com.ll.blog.global.jpa.entity.BaseTime;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 게시글 정보를 저장하는 JPA 엔티티 클래스
// DB 테이블과 매핑되는 클래스이며, 핵심 도메인 중 하나
@Entity // 엔티티임을 명시하는 어노테이션 (테이블과 매핑됨)
@Getter // lombok : 모든 필드의 Getter 자동 생성
@Builder // lombok : 객체 생성 시 Builder 패턴 사용가능
@NoArgsConstructor // lombok : 파라미터 없는 기본 생성자 생성
@AllArgsConstructor // lombok : 모든 필드 값을 받는 생성자 생성
public class Post extends BaseTime {
    
//    게시글 고유 식별자 (기본값)
//    자동 증가 -> AUTO_INCREMENT
    @Id // 이 키가 기본키 임을 명시
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB의 auto_increment 전략 사용
    private Long id;

//    게시글 제목
//    최대 100 글자
//    Not null
    @Column(length = 100, nullable =false) //  컬럼 길이 지정 및 not null
    private String title;

//    게시글 본문
//    길이 제한 없음
//    Not null
    @Column(columnDefinition = "TEXT", nullable = false) // TEXT 타입으로 지정
    private String content;

//    게시글 제목/내용 수정 메서드
    public void update(String title, String content, String emotion) {
        this.title = title;
        this.content = content;
        this.emotion = emotion;
    }

    private String author;

    @Column(nullable = true)
    private String emotion;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;
}