package com.PhamQuocTai.example05.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.PhamQuocTai.example05.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // Thêm dòng này
}
