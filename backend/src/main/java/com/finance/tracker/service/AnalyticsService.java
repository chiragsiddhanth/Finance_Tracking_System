package com.finance.tracker.service;

import com.finance.tracker.dto.DashboardAnalyticsDto;
import com.finance.tracker.dto.DashboardAnalyticsDto.*;
import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.Income;
import com.finance.tracker.repository.ExpenseRepository;
import com.finance.tracker.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class AnalyticsService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    public AnalyticsService(IncomeRepository incomeRepository, ExpenseRepository expenseRepository) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
    }

    public DashboardAnalyticsDto getDashboardAnalytics(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(29);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        if (startDate.isAfter(endDate)) {
            LocalDate temp = startDate;
            startDate = endDate;
            endDate = temp;
        }

        List<Income> incomes = incomeRepository.findByDateBetween(startDate, endDate);
        List<Expense> expenses = expenseRepository.findByDateBetween(startDate, endDate);

        // 1. Total Income
        BigDecimal totalIncome = incomes.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2. Total Expenses
        BigDecimal totalExpenses = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Net Savings = Income - Expenses
        BigDecimal netSavings = totalIncome.subtract(totalExpenses);

        // 4. Savings Percentage = (Net Savings / Total Income) * 100
        BigDecimal savingsPercentage = BigDecimal.ZERO;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsPercentage = netSavings
                    .multiply(BigDecimal.valueOf(100))
                    .divide(totalIncome, 2, RoundingMode.HALF_UP);
        }

        // 5. Average Daily Expenditure = Total Expenses / Number of Days
        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        if (daysBetween <= 0) daysBetween = 1;

        BigDecimal averageDailyExpenditure = totalExpenses.divide(BigDecimal.valueOf(daysBetween), 2, RoundingMode.HALF_UP);

        // Build Daily Maps
        Map<LocalDate, BigDecimal> dailyIncomeMap = new TreeMap<>();
        Map<LocalDate, BigDecimal> dailyExpenseMap = new TreeMap<>();

        for (LocalDate d = startDate; !d.isAfter(endDate); d = d.plusDays(1)) {
            dailyIncomeMap.put(d, BigDecimal.ZERO);
            dailyExpenseMap.put(d, BigDecimal.ZERO);
        }

        for (Income inc : incomes) {
            dailyIncomeMap.put(inc.getDate(), dailyIncomeMap.getOrDefault(inc.getDate(), BigDecimal.ZERO).add(inc.getAmount()));
        }

        for (Expense exp : expenses) {
            dailyExpenseMap.put(exp.getDate(), dailyExpenseMap.getOrDefault(exp.getDate(), BigDecimal.ZERO).add(exp.getAmount()));
        }

        // 6. Daily Savings Trend & Daily Expenditure
        List<DailySavingsTrendDto> dailySavingsTrend = new ArrayList<>();
        List<DailyExpenditureDto> dailyExpenditures = new ArrayList<>();

        BigDecimal runningCumulativeSavings = BigDecimal.ZERO;
        DateTimeFormatter dayFormatter = DateTimeFormatter.ISO_LOCAL_DATE;

        for (Map.Entry<LocalDate, BigDecimal> entry : dailyIncomeMap.entrySet()) {
            LocalDate date = entry.getKey();
            BigDecimal dInc = entry.getValue();
            BigDecimal dExp = dailyExpenseMap.getOrDefault(date, BigDecimal.ZERO);
            BigDecimal dSav = dInc.subtract(dExp);
            runningCumulativeSavings = runningCumulativeSavings.add(dSav);

            String formattedDate = date.format(dayFormatter);
            dailySavingsTrend.add(new DailySavingsTrendDto(formattedDate, dInc, dExp, dSav, runningCumulativeSavings));
            dailyExpenditures.add(new DailyExpenditureDto(formattedDate, dExp));
        }

        // 7. Expense Category Breakdown
        Map<Long, CategoryBreakdownDto> categoryMap = new HashMap<>();
        for (Expense exp : expenses) {
            Long catId = exp.getCategory() != null ? exp.getCategory().getId() : 0L;
            String catName = exp.getCategory() != null ? exp.getCategory().getName() : "Uncategorized";
            String catColor = exp.getCategory() != null ? exp.getCategory().getColor() : "#94a3b8";

            CategoryBreakdownDto item = categoryMap.getOrDefault(catId,
                    new CategoryBreakdownDto(catId, catName, catColor, BigDecimal.ZERO, BigDecimal.ZERO));
            item.setAmount(item.getAmount().add(exp.getAmount()));
            categoryMap.put(catId, item);
        }

        List<CategoryBreakdownDto> expenseCategoryBreakdown = new ArrayList<>(categoryMap.values());
        for (CategoryBreakdownDto item : expenseCategoryBreakdown) {
            if (totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal pct = item.getAmount()
                        .multiply(BigDecimal.valueOf(100))
                        .divide(totalExpenses, 2, RoundingMode.HALF_UP);
                item.setPercentage(pct);
            } else {
                item.setPercentage(BigDecimal.ZERO);
            }
        }
        expenseCategoryBreakdown.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));

        // 8. Monthly Comparison & Monthly Savings Trend
        Map<YearMonth, BigDecimal> monthlyIncomeMap = new TreeMap<>();
        Map<YearMonth, BigDecimal> monthlyExpenseMap = new TreeMap<>();

        YearMonth startYm = YearMonth.from(startDate);
        YearMonth endYm = YearMonth.from(endDate);
        for (YearMonth ym = startYm; !ym.isAfter(endYm); ym = ym.plusMonths(1)) {
            monthlyIncomeMap.put(ym, BigDecimal.ZERO);
            monthlyExpenseMap.put(ym, BigDecimal.ZERO);
        }

        for (Income inc : incomes) {
            YearMonth ym = YearMonth.from(inc.getDate());
            monthlyIncomeMap.put(ym, monthlyIncomeMap.getOrDefault(ym, BigDecimal.ZERO).add(inc.getAmount()));
        }

        for (Expense exp : expenses) {
            YearMonth ym = YearMonth.from(exp.getDate());
            monthlyExpenseMap.put(ym, monthlyExpenseMap.getOrDefault(ym, BigDecimal.ZERO).add(exp.getAmount()));
        }

        List<MonthlyComparisonDto> monthlyComparison = new ArrayList<>();
        List<MonthlySavingsTrendDto> monthlySavingsTrend = new ArrayList<>();
        BigDecimal monthlyCumulativeSavings = BigDecimal.ZERO;
        DateTimeFormatter ymFormatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (Map.Entry<YearMonth, BigDecimal> entry : monthlyIncomeMap.entrySet()) {
            YearMonth ym = entry.getKey();
            BigDecimal mInc = entry.getValue();
            BigDecimal mExp = monthlyExpenseMap.getOrDefault(ym, BigDecimal.ZERO);
            BigDecimal mSav = mInc.subtract(mExp);
            monthlyCumulativeSavings = monthlyCumulativeSavings.add(mSav);

            String formattedYm = ym.format(ymFormatter);
            monthlyComparison.add(new MonthlyComparisonDto(formattedYm, mInc, mExp, mSav));
            monthlySavingsTrend.add(new MonthlySavingsTrendDto(formattedYm, mSav, monthlyCumulativeSavings));
        }

        DashboardAnalyticsDto result = new DashboardAnalyticsDto();
        result.setTotalIncome(totalIncome);
        result.setTotalExpenses(totalExpenses);
        result.setNetSavings(netSavings);
        result.setSavingsPercentage(savingsPercentage);
        result.setAverageDailyExpenditure(averageDailyExpenditure);
        result.setTotalDays(daysBetween);
        result.setDailySavingsTrend(dailySavingsTrend);
        result.setMonthlyComparison(monthlyComparison);
        result.setExpenseCategoryBreakdown(expenseCategoryBreakdown);
        result.setMonthlySavingsTrend(monthlySavingsTrend);
        result.setDailyExpenditure(dailyExpenditures);

        return result;
    }
}

