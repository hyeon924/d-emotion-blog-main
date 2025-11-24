package com.ll.blog.domain.post.repository;

import com.ll.blog.domain.post.entity.Post;
import com.ll.blog.domain.user.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// post 엔티티를 DB와 연결하는 JPA Repository 인터페이스
// Spring Data JPA가 구현체를 자동으로 만들어줌
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
//    기본적인 CRUD 메서드는 JapRepository가 다 제공함

    List<Post> findByAuthor(String author);

    List<Post> findByUser(Users user);

    int countByUser(Users user);       // ✅ 개수만 조회용
}