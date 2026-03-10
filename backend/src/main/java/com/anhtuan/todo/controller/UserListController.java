package com.anhtuan.todo.controller;

import com.anhtuan.todo.entity.UserList;
import com.anhtuan.todo.repository.UserRepository;
import com.anhtuan.todo.service.UserListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class UserListController {

    private final UserListService userListService;
    private final UserRepository userRepository;

    @GetMapping
    public List<UserList> getLists(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUser(userDetails);
        return userListService.getLists(userId);
    }

    @PostMapping
    public UserList createList(@AuthenticationPrincipal UserDetails userDetails,
                               @RequestBody Map<String, String> body) {
        Long userId = getUser(userDetails);
        return userListService.createList(userId,
            body.get("name"),
            body.get("icon"),
            body.get("color"));
    }

    @DeleteMapping("/{listId}")
    public ResponseEntity<Void> deleteList(@AuthenticationPrincipal UserDetails userDetails,
                                           @PathVariable String listId) {
        Long userId = getUser(userDetails);
        userListService.deleteList(listId, userId);
        return ResponseEntity.noContent().build();
    }

    private Long getUser(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername()).orElseThrow().getId();
    }
}
