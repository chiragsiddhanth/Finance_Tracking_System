package com.finance.tracker.repository;

import com.finance.tracker.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {

    @Query("SELECT i FROM Income i WHERE (:startDate IS NULL OR i.date >= :startDate) " +
           "AND (:endDate IS NULL OR i.date <= :endDate) " +
           "AND (:categoryId IS NULL OR i.category.id = :categoryId) " +
           "AND (:search IS NULL OR LOWER(i.title) LIKE LOWER(CAST(CONCAT('%', :search, '%') AS String)) " +
           "     OR (i.description IS NOT NULL AND LOWER(CAST(i.description AS String)) LIKE LOWER(CAST(CONCAT('%', :search, '%') AS String)))) " +
           "ORDER BY i.date DESC, i.id DESC")
    List<Income> findWithFilters(@Param("startDate") LocalDate startDate,
                                 @Param("endDate") LocalDate endDate,
                                 @Param("categoryId") Long categoryId,
                                 @Param("search") String search);

    @Query("SELECT i FROM Income i WHERE i.date BETWEEN :startDate AND :endDate ORDER BY i.date ASC")
    List<Income> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
