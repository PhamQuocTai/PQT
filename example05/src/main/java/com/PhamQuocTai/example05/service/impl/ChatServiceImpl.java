package com.PhamQuocTai.example05.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.PhamQuocTai.example05.entity.Chat;
import com.PhamQuocTai.example05.entity.User;
import com.PhamQuocTai.example05.payloads.ChatDTO;
import com.PhamQuocTai.example05.repository.ChatRepository;
import com.PhamQuocTai.example05.repository.UserRepository;
import com.PhamQuocTai.example05.service.ChatService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ChatDTO saveChat(ChatDTO chatDTO) {
        try {
            Chat chat = new Chat();
            chat.setSender(new User(chatDTO.getSenderId()));
            chat.setReceiver(new User(chatDTO.getReceiverId()));
            chat.setMessage(chatDTO.getMessage());
            chat.setCreatedAt(chatDTO.getCreatedAt() != null ? chatDTO.getCreatedAt() : LocalDateTime.now());
            chat = chatRepository.save(chat);

            return new ChatDTO(
                chat.getId(),
                chat.getSender().getUserId(),
                chat.getReceiver().getUserId(),
                chat.getMessage(),
                chat.getCreatedAt()
            );
        } catch (Exception e) {
            e.printStackTrace();
            return new ChatDTO(null, chatDTO.getSenderId(), chatDTO.getReceiverId(),
                    "Lỗi khi lưu tin nhắn: " + e.getMessage(), LocalDateTime.now());
        }
    }

    @Override
    public List<ChatDTO> getChatsByUser(Long userId) {
        return chatRepository.findBySender_UserIdOrReceiver_UserId(userId, userId)
                .stream()
                .map(chat -> new ChatDTO(
                        chat.getId(),
                        chat.getSender().getUserId(),
                        chat.getReceiver().getUserId(),
                        chat.getMessage(),
                        chat.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public ChatDTO autoReply(Long userId, String message) {
        try {
            // 1. Lấy user nhận tin
            User receiver = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

            // 2. Lấy bot hoặc tạo mới
            User bot = userRepository.findByEmail("bot@example.com")
                    .orElseGet(() -> {
                        User newBot = new User();
                        newBot.setFirstName("System");
                        newBot.setLastName("ChatBot"); // fix: >=5 ký tự
                        newBot.setEmail("bot@example.com");
                        newBot.setPassword("nopassword");
                        return userRepository.save(newBot);
                    });

            // 3. Tạo nội dung trả lời
            String reply;
            if (message == null || message.trim().isEmpty()) {
                reply = "Xin chào! Bạn cần tôi tư vấn gì?";
            } else if (message.toLowerCase().contains("giờ làm việc")) {
                reply = "Chúng tôi làm việc từ 8h đến 17h, từ thứ 2 đến thứ 6.";
            } else if (message.toLowerCase().contains("liên hệ")) {
                reply = "Bạn có thể liên hệ qua email: support@example.com.";
            } else {
                reply = "Cảm ơn bạn đã nhắn tin! Chúng tôi sẽ phản hồi sớm nhất.";
            }

            // 4. Lưu tin nhắn bot gửi
            Chat chat = new Chat();
            chat.setSender(bot);
            chat.setReceiver(receiver);
            chat.setMessage(reply);
            chat.setCreatedAt(LocalDateTime.now());
            chat = chatRepository.save(chat);

            return new ChatDTO(
                    chat.getId(),
                    chat.getSender().getUserId(),
                    chat.getReceiver().getUserId(),
                    chat.getMessage(),
                    chat.getCreatedAt()
            );

        } catch (Exception e) {
            e.printStackTrace(); // In log lỗi chi tiết
            return new ChatDTO(userId, null, null, "Lỗi auto-reply: " + e.getMessage(), LocalDateTime.now());
        }
    }
}
