package com.PhamQuocTai.example05.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.PhamQuocTai.example05.entity.Chat;
import com.PhamQuocTai.example05.entity.User;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findBySender_UserIdOrReceiver_UserId(Long senderId, Long receiverId);

}