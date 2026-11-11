package com.finance.tracker.service;

import com.finance.tracker.dto.CategoryDto;
import com.finance.tracker.dto.PaymentMethodDto;
import com.finance.tracker.entity.Category;
import com.finance.tracker.entity.CategoryType;
import com.finance.tracker.entity.PaymentMethod;
import com.finance.tracker.exception.BadRequestException;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.CategoryRepository;
import com.finance.tracker.repository.PaymentMethodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    public CategoryService(CategoryRepository categoryRepository, PaymentMethodRepository paymentMethodRepository) {
        this.categoryRepository = categoryRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

    public List<CategoryDto> getCategories(CategoryType type) {
        List<Category> list = (type != null) 
                ? categoryRepository.findByTypeOrderByNameAsc(type)
                : categoryRepository.findAll();
        return list.stream().map(this::mapToCategoryDto).collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToCategoryDto(c);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByNameAndType(dto.getName().trim(), dto.getType())) {
            throw new BadRequestException("Category '" + dto.getName() + "' for type " + dto.getType() + " already exists");
        }
        Category category = new Category();
        category.setName(dto.getName().trim());
        category.setType(dto.getType());
        category.setColor(dto.getColor() != null && !dto.getColor().isBlank() ? dto.getColor() : "#6366f1");
        Category saved = categoryRepository.save(category);
        return mapToCategoryDto(saved);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        // check uniqueness if name changed
        if (!category.getName().equalsIgnoreCase(dto.getName().trim()) || category.getType() != dto.getType()) {
            if (categoryRepository.existsByNameAndType(dto.getName().trim(), dto.getType())) {
                throw new BadRequestException("Category '" + dto.getName() + "' for type " + dto.getType() + " already exists");
            }
        }

        category.setName(dto.getName().trim());
        category.setType(dto.getType());
        if (dto.getColor() != null && !dto.getColor().isBlank()) {
            category.setColor(dto.getColor());
        }
        return mapToCategoryDto(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        categoryRepository.delete(category);
    }

    public List<PaymentMethodDto> getPaymentMethods() {
        return paymentMethodRepository.findAll().stream()
                .map(pm -> new PaymentMethodDto(pm.getId(), pm.getName()))
                .collect(Collectors.toList());
    }

    public CategoryDto mapToCategoryDto(Category category) {
        if (category == null) return null;
        return new CategoryDto(category.getId(), category.getName(), category.getType(), category.getColor());
    }
}

