package com.finance.tracker.service;

import com.finance.tracker.dto.ExpenseDto;
import com.finance.tracker.dto.IncomeDto;
import com.finance.tracker.dto.TransactionDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final IncomeService incomeService;
    private final ExpenseService expenseService;

    public TransactionService(IncomeService incomeService, ExpenseService expenseService) {
        this.incomeService = incomeService;
        this.expenseService = expenseService;
    }

    public List<TransactionDto> getAllTransactions(LocalDate startDate,
                                                   LocalDate endDate,
                                                   String type,
                                                   Long categoryId,
                                                   Long paymentMethodId,
                                                   String search,
                                                   String sortBy,
                                                   String sortOrder) {
        List<TransactionDto> transactions = new ArrayList<>();

        boolean includeIncome = type == null || type.equalsIgnoreCase("ALL") || type.equalsIgnoreCase("INCOME");
        boolean includeExpense = type == null || type.equalsIgnoreCase("ALL") || type.equalsIgnoreCase("EXPENSE");

        if (includeIncome && paymentMethodId == null) {
            List<IncomeDto> incomes = incomeService.getIncomes(startDate, endDate, categoryId, search);
            for (IncomeDto inc : incomes) {
                TransactionDto t = new TransactionDto();
                t.setId(inc.getId());
                t.setType("INCOME");
                t.setTitle(inc.getTitle());
                t.setAmount(inc.getAmount());
                t.setCategoryId(inc.getCategoryId());
                t.setCategoryName(inc.getCategoryName());
                t.setCategoryColor(inc.getCategoryColor());
                t.setDate(inc.getDate());
                t.setDescription(inc.getDescription());
                transactions.add(t);
            }
        }

        if (includeExpense) {
            List<ExpenseDto> expenses = expenseService.getExpenses(startDate, endDate, categoryId, paymentMethodId, search);
            for (ExpenseDto exp : expenses) {
                TransactionDto t = new TransactionDto();
                t.setId(exp.getId());
                t.setType("EXPENSE");
                t.setTitle(exp.getTitle());
                t.setAmount(exp.getAmount());
                t.setCategoryId(exp.getCategoryId());
                t.setCategoryName(exp.getCategoryName());
                t.setCategoryColor(exp.getCategoryColor());
                t.setPaymentMethodId(exp.getPaymentMethodId());
                t.setPaymentMethodName(exp.getPaymentMethodName());
                t.setDate(exp.getDate());
                t.setDescription(exp.getDescription());
                transactions.add(t);
            }
        }

        // Sorting
        Comparator<TransactionDto> comparator = Comparator.comparing(TransactionDto::getDate);
        if ("amount".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(TransactionDto::getAmount);
        } else if ("title".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(TransactionDto::getTitle, String.CASE_INSENSITIVE_ORDER);
        }

        if ("asc".equalsIgnoreCase(sortOrder)) {
            transactions.sort(comparator);
        } else {
            transactions.sort(comparator.reversed());
        }

        return transactions;
    }
}

