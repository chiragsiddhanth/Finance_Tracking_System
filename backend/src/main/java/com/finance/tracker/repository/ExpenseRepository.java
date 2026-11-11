package com.finance.tracker.repository;

import com.finance.tracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT e FROM Expense e WHERE (:startDate IS NULL OR e.date >= :startDate) " +
           "AND (:endDate IS NULL OR e.date <= :endDate) " +
           "AND (:categoryId IS NULL OR e.category.id = :categoryId) " +
           "AND (:paymentMethodId IS NULL OR e.paymentMethod.id = :paymentMethodId) " +
           "AND (:search IS NULL OR LOWER(e.title) LIKE LOWER(CAST(CONCAT('%', :search, '%') AS String)) " +
           "     OR (e.description IS NOT NULL AND LOWER(CAST(e.description AS String)) LIKE LOWER(CAST(CONCAT('%', :search, '%') AS String)))) " +
           "ORDER BY e.date DESC, e.id DESC")
    List<Expense> findWithFilters(@Param("startDate") LocalDate startDate,
                                  @Param("endDate") LocalDate endDate,
                                  @Param("categoryId") Long categoryId,
                                  @Param("paymentMethodId") Long paymentMethodId,
                                  @Param("search") String search);

    @Query("SELECT e FROM Expense e WHERE e.date BETWEEN :startDate AND :endDate ORDER BY e.date ASC")
    List<Expense> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
