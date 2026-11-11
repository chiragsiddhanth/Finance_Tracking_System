package com.finance.tracker.repository;

import com.finance.tracker.entity.Category;
import com.finance.tracker.entity.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByTypeOrderByNameAsc(CategoryType type);
    Optional<Category> findByNameAndType(String name, CategoryType type);
    boolean existsByNameAndType(String name, CategoryType type);
}

