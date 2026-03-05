package com.anhtuan.todo.repository;

import com.anhtuan.todo.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    // Tất cả todos của user, mới nhất trước
    List<Todo> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Todos theo user + listId
    List<Todo> findByUserIdAndListIdOrderByCreatedAtDesc(Long userId, String listId);

    // Tìm theo id + userId (bảo mật: không cho user A xóa todo của user B)
    Optional<Todo> findByIdAndUserId(Long id, Long userId);

    // Lấy danh sách listId distinct của user
    @Query("SELECT DISTINCT t.listId FROM Todo t WHERE t.user.id = :userId")
    List<String> findDistinctListIdsByUserId(@Param("userId") Long userId);
}
