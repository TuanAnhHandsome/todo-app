package com.anhtuan.todo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDto {

    @Data
    public static class Request {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be 3–50 characters")
        private String username;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;
    }

    @Data
    public static class Response {
        private Long   id;
        private String username;
        private String token;

        public Response(Long id, String username, String token) {
            this.id       = id;
            this.username = username;
            this.token    = token;
        }
    }
}
