package com.anhtuan.todo.service;

import com.anhtuan.todo.entity.Todo;
import com.anhtuan.todo.entity.User;
import com.anhtuan.todo.repository.TodoRepository;
import com.anhtuan.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    // Lấy user từ username (dùng chung)
    private User getUser(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // Lấy tất cả todos của user
    public List<Todo> getAll(String username) {
        User user = getUser(username);
        return todoRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    // Tạo todo mới
    public Todo create(String username, String text) {
        User user = getUser(username);
        Todo todo = Todo.builder()
            .text(text)
            .completed(false)
            .user(user)
            .build();
        return todoRepository.save(todo);
    }

    // Cập nhật text và/hoặc completed
    public Todo update(String username, Long todoId, String text, Boolean completed) {
        User user = getUser(username);

        Todo todo = todoRepository.findByIdAndUserId(todoId, user.getId())
            .orElseThrow(() -> new RuntimeException("Todo not found"));

        if (text      != null) todo.setText(text);
        if (completed != null) todo.setCompleted(completed);

        return todoRepository.save(todo);
    }

    // Xóa todo
    public void delete(String username, Long todoId) {
        User user = getUser(username);

        Todo todo = todoRepository.findByIdAndUserId(todoId, user.getId())
            .orElseThrow(() -> new RuntimeException("Todo not found"));

        todoRepository.delete(todo);
    }
}
