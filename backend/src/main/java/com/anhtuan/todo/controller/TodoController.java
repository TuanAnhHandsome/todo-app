package com.anhtuan.todo.controller;

import com.anhtuan.todo.entity.Todo;
import com.anhtuan.todo.service.TodoService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    // GET /api/todos
    @GetMapping
    public ResponseEntity<List<Todo>> getAll(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(todoService.getAll(userDetails.getUsername()));
    }

    // POST /api/todos
    @PostMapping
    public ResponseEntity<Todo> create(
        @AuthenticationPrincipal UserDetails userDetails,
        @Valid @RequestBody CreateRequest body
    ) {
        return ResponseEntity.ok(
            todoService.create(userDetails.getUsername(), body.getText())
        );
    }

    // PUT /api/todos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Todo> update(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable Long id,
        @RequestBody UpdateRequest body
    ) {
        return ResponseEntity.ok(
            todoService.update(userDetails.getUsername(), id, body.getText(), body.getCompleted())
        );
    }

    // DELETE /api/todos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable Long id
    ) {
        todoService.delete(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    // ── Inner request classes (không dùng Lombok để tránh lỗi) ──

    static class CreateRequest {
        @NotBlank
        @Size(max = 200)
        private String text;

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    static class UpdateRequest {
        @Size(max = 200)
        private String  text;
        private Boolean completed;

        public String  getText()      { return text; }
        public Boolean getCompleted() { return completed; }
        public void setText(String text)          { this.text = text; }
        public void setCompleted(Boolean completed){ this.completed = completed; }
    }
}
