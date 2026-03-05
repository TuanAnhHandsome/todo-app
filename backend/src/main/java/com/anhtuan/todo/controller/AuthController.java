package com.anhtuan.todo.controller;

import com.anhtuan.todo.dto.AuthDto;
import com.anhtuan.todo.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthDto.Response> register(@Valid @RequestBody AuthDto.Request req) {
        return ResponseEntity.ok(authService.register(req));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthDto.Response> login(@Valid @RequestBody AuthDto.Request req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
