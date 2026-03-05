package com.anhtuan.todo.controller;

import com.anhtuan.todo.entity.Todo;
import com.anhtuan.todo.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    // GET /api/todos              → tất cả todos
    // GET /api/todos?listId=work  → todos theo list
    @GetMapping
    public ResponseEntity<List<Todo>> getAll(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestParam(required = false) String listId
    ) {
        return ResponseEntity.ok(
            todoService.getAll(userDetails.getUsername(), listId)
        );
    }

    // GET /api/todos/lists → danh sách listId unique của user
    @GetMapping("/lists")
    public ResponseEntity<List<String>> getLists(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(
            todoService.getLists(userDetails.getUsername())
        );
    }

    // POST /api/todos
    @PostMapping
    public ResponseEntity<Todo> create(
        @AuthenticationPrincipal UserDetails userDetails,
        @Valid @RequestBody CreateRequest body
    ) {
        return ResponseEntity.ok(
            todoService.create(userDetails.getUsername(), body)
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
            todoService.update(userDetails.getUsername(), id, body)
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

    // DELETE /api/todos/list/{listId} → xóa tất cả todos trong 1 list
    @DeleteMapping("/list/{listId}")
    public ResponseEntity<Map<String, Integer>> deleteByList(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable String listId
    ) {
        int count = todoService.deleteByList(userDetails.getUsername(), listId);
        return ResponseEntity.ok(Map.of("deleted", count));
    }

}