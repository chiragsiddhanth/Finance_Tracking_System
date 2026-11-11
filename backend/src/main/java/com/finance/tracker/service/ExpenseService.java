package com.finance.tracker.service;

import com.finance.tracker.dto.ExpenseDto;
import com.finance.tracker.entity.Category;
import com.finance.tracker.entity.CategoryType;
import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.PaymentMethod;
import com.finance.tracker.exception.BadRequestException;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.CategoryRepository;
import com.finance.tracker.repository.ExpenseRepository;
import com.finance.tracker.repository.PaymentMethodRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public ExpenseService(ExpenseRepository expenseRepository,
                          CategoryRepository categoryRepository,
                          PaymentMethodRepository paymentMethodRepository) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

    public List<ExpenseDto> getExpenses(LocalDate startDate, LocalDate endDate, Long categoryId, Long paymentMethodId, String search) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Expense> cq = cb.createQuery(Expense.class);
        Root<Expense> root = cq.from(Expense.class);

        List<Predicate> predicates = new ArrayList<>();

        if (startDate != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("date"), startDate));
        }
        if (endDate != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("date"), endDate));
        }
        if (categoryId != null) {
            predicates.add(cb.equal(root.get("category").get("id"), categoryId));
        }
        if (paymentMethodId != null) {
            predicates.add(cb.equal(root.get("paymentMethod").get("id"), paymentMethodId));
        }
        if (search != null && !search.trim().isEmpty()) {
            String pattern = "%" + search.trim().toLowerCase() + "%";
            Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
            Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
            predicates.add(cb.or(titleMatch, descMatch));
        }

        cq.where(predicates.toArray(new Predicate[0]));
        cq.orderBy(cb.desc(root.get("date")), cb.desc(root.get("id")));

        List<Expense> expenses = entityManager.createQuery(cq).getResultList();
        return expenses.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ExpenseDto getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        return mapToDto(expense);
    }

    @Transactional
    public ExpenseDto createExpense(ExpenseDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        if (category.getType() != CategoryType.EXPENSE) {
            throw new BadRequestException("Category must be of type EXPENSE");
        }

        PaymentMethod paymentMethod = paymentMethodRepository.findById(dto.getPaymentMethodId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment Method not found with id: " + dto.getPaymentMethodId()));

        Expense expense = new Expense();
        expense.setTitle(dto.getTitle().trim());
        expense.setAmount(dto.getAmount());
        expense.setCategory(category);
        expense.setPaymentMethod(paymentMethod);
        expense.setDate(dto.getDate());
        expense.setDescription(dto.getDescription());

        return mapToDto(expenseRepository.save(expense));
    }

    @Transactional
    public ExpenseDto updateExpense(Long id, ExpenseDto dto) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        if (category.getType() != CategoryType.EXPENSE) {
            throw new BadRequestException("Category must be of type EXPENSE");
        }

        PaymentMethod paymentMethod = paymentMethodRepository.findById(dto.getPaymentMethodId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment Method not found with id: " + dto.getPaymentMethodId()));

        expense.setTitle(dto.getTitle().trim());
        expense.setAmount(dto.getAmount());
        expense.setCategory(category);
        expense.setPaymentMethod(paymentMethod);
        expense.setDate(dto.getDate());
        expense.setDescription(dto.getDescription());

        return mapToDto(expenseRepository.save(expense));
    }

    @Transactional
    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        expenseRepository.delete(expense);
    }

    public ExpenseDto mapToDto(Expense expense) {
        if (expense == null) return null;
        ExpenseDto dto = new ExpenseDto();
        dto.setId(expense.getId());
        dto.setTitle(expense.getTitle());
        dto.setAmount(expense.getAmount());
        if (expense.getCategory() != null) {
            dto.setCategoryId(expense.getCategory().getId());
            dto.setCategoryName(expense.getCategory().getName());
            dto.setCategoryColor(expense.getCategory().getColor());
        }
        if (expense.getPaymentMethod() != null) {
            dto.setPaymentMethodId(expense.getPaymentMethod().getId());
            dto.setPaymentMethodName(expense.getPaymentMethod().getName());
        }
        dto.setDate(expense.getDate());
        dto.setDescription(expense.getDescription());
        return dto;
    }
}
