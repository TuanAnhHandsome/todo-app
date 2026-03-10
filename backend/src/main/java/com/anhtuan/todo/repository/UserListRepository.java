package com.anhtuan.todo.repository;

import com.anhtuan.todo.entity.UserList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserListRepository extends JpaRepository<UserList, String> {
    List<UserList> findByUserIdOrderByCreatedAtAsc(Long userId);
    void deleteByIdAndUserId(String id, Long userId);
}
