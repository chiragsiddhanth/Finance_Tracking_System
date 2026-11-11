package com.finance.tracker.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardAnalyticsDto {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netSavings;
    private BigDecimal savingsPercentage;
    private BigDecimal averageDailyExpenditure;
    private long totalDays;

    private List<DailySavingsTrendDto> dailySavingsTrend;
    private List<MonthlyComparisonDto> monthlyComparison;
    private List<CategoryBreakdownDto> expenseCategoryBreakdown;
    private List<MonthlySavingsTrendDto> monthlySavingsTrend;
    private List<DailyExpenditureDto> dailyExpenditure;

    public DashboardAnalyticsDto() {}

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getNetSavings() {
        return netSavings;
    }

    public void setNetSavings(BigDecimal netSavings) {
        this.netSavings = netSavings;
    }

    public BigDecimal getSavingsPercentage() {
        return savingsPercentage;
    }

    public void setSavingsPercentage(BigDecimal savingsPercentage) {
        this.savingsPercentage = savingsPercentage;
    }

    public BigDecimal getAverageDailyExpenditure() {
        return averageDailyExpenditure;
    }

    public void setAverageDailyExpenditure(BigDecimal averageDailyExpenditure) {
        this.averageDailyExpenditure = averageDailyExpenditure;
    }

    public long getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(long totalDays) {
        this.totalDays = totalDays;
    }

    public List<DailySavingsTrendDto> getDailySavingsTrend() {
        return dailySavingsTrend;
    }

    public void setDailySavingsTrend(List<DailySavingsTrendDto> dailySavingsTrend) {
        this.dailySavingsTrend = dailySavingsTrend;
    }

    public List<MonthlyComparisonDto> getMonthlyComparison() {
        return monthlyComparison;
    }

    public void setMonthlyComparison(List<MonthlyComparisonDto> monthlyComparison) {
        this.monthlyComparison = monthlyComparison;
    }

    public List<CategoryBreakdownDto> getExpenseCategoryBreakdown() {
        return expenseCategoryBreakdown;
    }

    public void setExpenseCategoryBreakdown(List<CategoryBreakdownDto> expenseCategoryBreakdown) {
        this.expenseCategoryBreakdown = expenseCategoryBreakdown;
    }

    public List<MonthlySavingsTrendDto> getMonthlySavingsTrend() {
        return monthlySavingsTrend;
    }

    public void setMonthlySavingsTrend(List<MonthlySavingsTrendDto> monthlySavingsTrend) {
        this.monthlySavingsTrend = monthlySavingsTrend;
    }

    public List<DailyExpenditureDto> getDailyExpenditure() {
        return dailyExpenditure;
    }

    public void setDailyExpenditure(List<DailyExpenditureDto> dailyExpenditure) {
        this.dailyExpenditure = dailyExpenditure;
    }

    // Nested DTOs
    public static class DailySavingsTrendDto {
        private String date; // YYYY-MM-DD
        private BigDecimal dailyIncome;
        private BigDecimal dailyExpense;
        private BigDecimal dailySavings;
        private BigDecimal cumulativeSavings;

        public DailySavingsTrendDto() {}

        public DailySavingsTrendDto(String date, BigDecimal dailyIncome, BigDecimal dailyExpense, BigDecimal dailySavings, BigDecimal cumulativeSavings) {
            this.date = date;
            this.dailyIncome = dailyIncome;
            this.dailyExpense = dailyExpense;
            this.dailySavings = dailySavings;
            this.cumulativeSavings = cumulativeSavings;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public BigDecimal getDailyIncome() { return dailyIncome; }
        public void setDailyIncome(BigDecimal dailyIncome) { this.dailyIncome = dailyIncome; }
        public BigDecimal getDailyExpense() { return dailyExpense; }
        public void setDailyExpense(BigDecimal dailyExpense) { this.dailyExpense = dailyExpense; }
        public BigDecimal getDailySavings() { return dailySavings; }
        public void setDailySavings(BigDecimal dailySavings) { this.dailySavings = dailySavings; }
        public BigDecimal getCumulativeSavings() { return cumulativeSavings; }
        public void setCumulativeSavings(BigDecimal cumulativeSavings) { this.cumulativeSavings = cumulativeSavings; }
    }

    public static class MonthlyComparisonDto {
        private String month; // e.g. "2026-03" or "Mar 2026"
        private BigDecimal income;
        private BigDecimal expense;
        private BigDecimal savings;

        public MonthlyComparisonDto() {}

        public MonthlyComparisonDto(String month, BigDecimal income, BigDecimal expense, BigDecimal savings) {
            this.month = month;
            this.income = income;
            this.expense = expense;
            this.savings = savings;
        }

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public BigDecimal getIncome() { return income; }
        public void setIncome(BigDecimal income) { this.income = income; }
        public BigDecimal getExpense() { return expense; }
        public void setExpense(BigDecimal expense) { this.expense = expense; }
        public BigDecimal getSavings() { return savings; }
        public void setSavings(BigDecimal savings) { this.savings = savings; }
    }

    public static class CategoryBreakdownDto {
        private Long categoryId;
        private String categoryName;
        private String color;
        private BigDecimal amount;
        private BigDecimal percentage;

        public CategoryBreakdownDto() {}

        public CategoryBreakdownDto(Long categoryId, String categoryName, String color, BigDecimal amount, BigDecimal percentage) {
            this.categoryId = categoryId;
            this.categoryName = categoryName;
            this.color = color;
            this.amount = amount;
            this.percentage = percentage;
        }

        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public BigDecimal getPercentage() { return percentage; }
        public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }
    }

    public static class MonthlySavingsTrendDto {
        private String month;
        private BigDecimal savings;
        private BigDecimal cumulativeSavings;

        public MonthlySavingsTrendDto() {}

        public MonthlySavingsTrendDto(String month, BigDecimal savings, BigDecimal cumulativeSavings) {
            this.month = month;
            this.savings = savings;
            this.cumulativeSavings = cumulativeSavings;
        }

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public BigDecimal getSavings() { return savings; }
        public void setSavings(BigDecimal savings) { this.savings = savings; }
        public BigDecimal getCumulativeSavings() { return cumulativeSavings; }
        public void setCumulativeSavings(BigDecimal cumulativeSavings) { this.cumulativeSavings = cumulativeSavings; }
    }

    public static class DailyExpenditureDto {
        private String date;
        private BigDecimal amount;

        public DailyExpenditureDto() {}

        public DailyExpenditureDto(String date, BigDecimal amount) {
            this.date = date;
            this.amount = amount;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
    }
}

