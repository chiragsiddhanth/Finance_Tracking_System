package com.finance.tracker.service;

import com.finance.tracker.dto.IncomeDto;
import com.finance.tracker.entity.Category;
import com.finance.tracker.entity.CategoryType;
import com.finance.tracker.entity.Income;
import com.finance.tracker.exception.BadRequestException;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.CategoryRepository;
import com.finance.tracker.repository.IncomeRepository;
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
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final CategoryRepository categoryRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public IncomeService(IncomeRepository incomeRepository, CategoryRepository categoryRepository) {
        this.incomeRepository = incomeRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<IncomeDto> getIncomes(LocalDate startDate, LocalDate endDate, Long categoryId, String search) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Income> cq = cb.createQuery(Income.class);
        Root<Income> root = cq.from(Income.class);

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
        if (search != null && !search.trim().isEmpty()) {
            String pattern = "%" + search.trim().toLowerCase() + "%";
            Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
            Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
            predicates.add(cb.or(titleMatch, descMatch));
        }

        cq.where(predicates.toArray(new Predicate[0]));
        cq.orderBy(cb.desc(root.get("date")), cb.desc(root.get("id")));

        List<Income> incomes = entityManager.createQuery(cq).getResultList();
        return incomes.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public IncomeDto getIncomeById(Long id) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + id));
        return mapToDto(income);
    }

    @Transactional
    public IncomeDto createIncome(IncomeDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        if (category.getType() != CategoryType.INCOME) {
            throw new BadRequestException("Category must be of type INCOME");
        }

        Income income = new Income();
        income.setTitle(dto.getTitle().trim());
        income.setAmount(dto.getAmount());
        income.setCategory(category);
        income.setDate(dto.getDate());
        income.setDescription(dto.getDescription());

        return mapToDto(incomeRepository.save(income));
    }

    @Transactional
    public IncomeDto updateIncome(Long id, IncomeDto dto) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + id));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        if (category.getType() != CategoryType.INCOME) {
            throw new BadRequestException("Category must be of type INCOME");
        }

        income.setTitle(dto.getTitle().trim());
        income.setAmount(dto.getAmount());
        income.setCategory(category);
        income.setDate(dto.getDate());
        income.setDescription(dto.getDescription());

        return mapToDto(incomeRepository.save(income));
    }

    @Transactional
    public void deleteIncome(Long id) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + id));
        incomeRepository.delete(income);
    }

    public IncomeDto mapToDto(Income income) {
        if (income == null) return null;
        IncomeDto dto = new IncomeDto();
        dto.setId(income.getId());
        dto.setTitle(income.getTitle());
        dto.setAmount(income.getAmount());
        if (income.getCategory() != null) {
            dto.setCategoryId(income.getCategory().getId());
            dto.setCategoryName(income.getCategory().getName());
            dto.setCategoryColor(income.getCategory().getColor());
        }
        dto.setDate(income.getDate());
        dto.setDescription(income.getDescription());
        return dto;
    }
}
