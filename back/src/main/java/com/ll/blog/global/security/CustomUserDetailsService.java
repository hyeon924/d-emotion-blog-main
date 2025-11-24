package com.ll.blog.global.security;

import com.ll.blog.domain.user.entity.Users; // ✅ Users로 변경!
import com.ll.blog.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findByUsername(username) // ✅ Users 사용
                .orElseThrow(() -> new UsernameNotFoundException("해당 사용자가 없습니다: " + username));

        return new CustomUserDetails(user);
    }
}
