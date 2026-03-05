package com.anhtuan.todo.service;

import com.anhtuan.todo.controller.CreateRequest;
import com.anhtuan.todo.controller.UpdateRequest;
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

    private User getUser(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // Lấy todos — có thể filter theo listId
    public List<Todo> getAll(String username, String listId) {
        User user = getUser(username);
        if (listId != null && !listId.isBlank()) {
            return todoRepository.findByUserIdAndListIdOrderByCreatedAtDesc(user.getId(), listId);
        }
        return todoRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    // Lấy danh sách listId unique của user
    public List<String> getLists(String username) {
        User user = getUser(username);
        return todoRepository.findDistinctListIdsByUserId(user.getId());
    }

    // Tạo todo mới với đầy đủ fields
    public Todo create(String username, CreateRequest req) {
        User user = getUser(username);
        Todo todo = Todo.builder()
            .text(req.getText())
            .completed(false)
            .priority(req.getPriority() != null ? req.getPriority() : "medium")
            .deadline(req.getDeadline())
            .listId(req.getListId() != null ? req.getListId() : "personal")
            .user(user)
            .build();
        return todoRepository.save(todo);
    }

    // Cập nhật — chỉ đổi field nào không null
    public Todo update(String username, Long todoId, UpdateRequest req) {
        User user = getUser(username);
        Todo todo = todoRepository.findByIdAndUserId(todoId, user.getId())
            .orElseThrow(() -> new RuntimeException("Todo not found"));

        if (req.getText()      != null) todo.setText(req.getText());
        if (req.getCompleted() != null) todo.setCompleted(req.getCompleted());
        if (req.getPriority()  != null) todo.setPriority(req.getPriority());
        if (req.getListId()    != null) todo.setListId(req.getListId());

        // Deadline có thể set null để xóa deadline
        if (req.getDeadline() != null) todo.setDeadline(req.getDeadline());

        return todoRepository.save(todo);
    }

    // Xóa 1 todo
    public void delete(String username, Long todoId) {
        User user = getUser(username);
        Todo todo = todoRepository.findByIdAndUserId(todoId, user.getId())
            .orElseThrow(() -> new RuntimeException("Todo not found"));
        todoRepository.delete(todo);
    }

    // Xóa tất cả todos trong 1 list — trả về số lượng đã xóa
    public int deleteByList(String username, String listId) {
        User user = getUser(username);
        List<Todo> todos = todoRepository.findByUserIdAndListIdOrderByCreatedAtDesc(user.getId(), listId);
        todoRepository.deleteAll(todos);
        return todos.size();
    }
}