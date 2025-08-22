package com.PhamQuocTai.example05.payloads;

import java.time.LocalDateTime;

public class ChatDTO {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String message;
    private LocalDateTime createdAt;

    public ChatDTO() {}

    public ChatDTO(Long id, Long senderId, Long receiverId, String message, LocalDateTime createdAt) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.message = message;
        this.createdAt = createdAt;
    }

    // Getter & Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
