package com.anhtuan.todo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_lists")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserList {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String icon = "📁";

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String color = "#6366f1";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @JsonIgnore
    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}