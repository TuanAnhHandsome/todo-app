package com.anhtuan.todo.service;

import com.anhtuan.todo.entity.User;
import com.anhtuan.todo.entity.UserList;
import com.anhtuan.todo.repository.UserListRepository;
import com.anhtuan.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserListService {

    private final UserListRepository userListRepository;
    private final UserRepository userRepository;

    public List<UserList> getLists(Long userId) {
        List<UserList> lists = userListRepository.findByUserIdOrderByCreatedAtAsc(userId);

        // Nếu chưa có list nào, tạo 3 list mặc định
        if (lists.isEmpty()) {
            User user = userRepository.findById(userId).orElseThrow();
            lists = List.of(
                createDefault(user, "personal", "Personal", "👤", "#6366f1"),
                createDefault(user, "work",     "Work",     "💼", "#f59e0b"),
                createDefault(user, "study",    "Study",    "📚", "#10b981")
            );
            userListRepository.saveAll(lists);
        }
        return lists;
    }

    public UserList createList(Long userId, String name, String icon, String color) {
        User user = userRepository.findById(userId).orElseThrow();
        String id = "list_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        UserList list = UserList.builder()
            .id(id)
            .name(name)
            .icon(icon != null ? icon : "📁")
            .color(color != null ? color : "#6366f1")
            .user(user)
            .build();
        return userListRepository.save(list);
    }

    @Transactional
    public void deleteList(String listId, Long userId) {
        userListRepository.deleteByIdAndUserId(listId, userId);
    }

    private UserList createDefault(User user, String id, String name, String icon, String color) {
        return UserList.builder()
            .id(id).name(name).icon(icon).color(color).user(user).build();
    }
}
