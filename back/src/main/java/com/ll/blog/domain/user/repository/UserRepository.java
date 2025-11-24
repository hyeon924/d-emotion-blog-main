package com.ll.blog.domain.user.repository;

import com.ll.blog.domain.user.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {

    // username으로 사용자 찾기(로그인시 사용)
    Optional<Users> findByUsername(String username);

    // 회원가입 시 아이디 중복체크
    boolean existsByUsername(String username);

    boolean existsByNickname(String nickname);

}
