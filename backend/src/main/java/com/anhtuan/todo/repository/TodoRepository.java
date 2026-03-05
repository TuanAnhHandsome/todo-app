package com.anhtuan.todo.repository;

import com.anhtuan.todo.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    // Lấy tất cả todo của 1 user, mới nhất trước
    List<Todo> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Tìm todo theo id VÀ userId (tránh user A xóa todo của user B)
    Optional<Todo> findByIdAndUserId(Long id, Long userId);
}
