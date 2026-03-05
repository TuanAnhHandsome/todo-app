package com.anhtuan.todo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "todos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String text;

    @Column(nullable = false)
    @Builder.Default
    private boolean completed = false;

    // 'high' | 'medium' | 'low'
    @Column(nullable = false, length = 10)
    @Builder.Default
    private String priority = "medium";

    // Deadline (nullable)
    @Column(name = "deadline")
    private LocalDate deadline;

    // List ID (ví dụ: 'personal', 'work', 'study', hoặc custom id)
    @Column(name = "list_id", length = 50)
    @Builder.Default
    private String listId = "personal";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}