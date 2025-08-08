package com.PhamQuocTai.example05.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.PhamQuocTai.example05.entity.OrderItem;

@Repository

public interface OrderItemRepo   extends JpaRepository<OrderItem,Long> {
    
}
