package com.PhamQuocTai.example05.service;

import java.util.List;

import com.PhamQuocTai.example05.entity.Chat;
import com.PhamQuocTai.example05.entity.User;
import com.PhamQuocTai.example05.payloads.ChatDTO;

public interface ChatService {
    ChatDTO saveChat(ChatDTO chatDTO);
    List<ChatDTO> getChatsByUser(Long userId);
}