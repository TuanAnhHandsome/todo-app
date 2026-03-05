package com.anhtuan.todo.config;

import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

// Bắt exception và trả về JSON đẹp thay vì stack trace
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Lỗi validation (@NotBlank, @Size, ...)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors()
            .stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining(", "));

        return ResponseEntity.badRequest().body(Map.of(
            "error",   "Validation failed",
            "message", message
        ));
    }

    // Sai username/password
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
            "error",   "Unauthorized",
            "message", "Invalid username or password"
        ));
    }

    // Username đã tồn tại, todo not found, ...
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArg(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of(
            "error",   "Bad Request",
            "message", ex.getMessage()
        ));
    }

    // Todo not found
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
            "error",   "Not Found",
            "message", ex.getMessage()
        ));
    }
}
