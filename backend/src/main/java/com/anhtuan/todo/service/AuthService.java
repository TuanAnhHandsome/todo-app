package com.anhtuan.todo.service;

import com.anhtuan.todo.dto.AuthDto;
import com.anhtuan.todo.entity.User;
import com.anhtuan.todo.repository.UserRepository;
import com.anhtuan.todo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository        userRepository;
    private final PasswordEncoder       passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil               jwtUtil;

    // Đăng ký
    public AuthDto.Response register(AuthDto.Request req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = User.builder()
            .username(req.getUsername())
            .password(passwordEncoder.encode(req.getPassword()))
            .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthDto.Response(user.getId(), user.getUsername(), token);
    }

    // Đăng nhập
    public AuthDto.Response login(AuthDto.Request req) {
        // Spring Security tự so sánh password đã hash
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        User user = userRepository.findByUsername(auth.getName())
            .orElseThrow();

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthDto.Response(user.getId(), user.getUsername(), token);
    }
}
