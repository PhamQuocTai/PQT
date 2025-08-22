package com.PhamQuocTai.example05.service;

import java.util.List;
import com.PhamQuocTai.example05.payloads.ChatDTO;

public interface ChatService {
    ChatDTO saveChat(ChatDTO chatDTO);
    List<ChatDTO> getChatsByUser(Long userId);
    ChatDTO autoReply(Long userId, String message);
}
