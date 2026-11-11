package com.finance.tracker.service;

import com.finance.tracker.entity.Category;
import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.Income;
import com.finance.tracker.entity.PaymentMethod;
import com.finance.tracker.repository.CategoryRepository;
import com.finance.tracker.repository.ExpenseRepository;
import com.finance.tracker.repository.IncomeRepository;
import com.finance.tracker.repository.PaymentMethodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class DemoDataService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    public DemoDataService(IncomeRepository incomeRepository,
                           ExpenseRepository expenseRepository,
                           CategoryRepository categoryRepository,
                           PaymentMethodRepository paymentMethodRepository) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @Transactional
    public void clearAllTransactions() {
        expenseRepository.deleteAllInBatch();
        incomeRepository.deleteAllInBatch();
    }

    @Transactional
    public void populateMockData() {
        // Clear first so we have clean demonstration data
        clearAllTransactions();

        List<Category> allCategories = categoryRepository.findAll();
        List<PaymentMethod> allPaymentMethods = paymentMethodRepository.findAll();

        Category salaryCat = allCategories.stream().filter(c -> c.getName().equalsIgnoreCase("Salary")).findFirst().orElse(null);
        Category freelanceCat = allCategories.stream().filter(c -> c.getName().equalsIgnoreCase("Freelancing")).findFirst().orElse(null);
        Category businessCat = allCategories.stream().filter(c -> c.getName().equalsIgnoreCase("Business")).findFirst().orElse(null);
        Category investCat = allCategories.stream().filter(c -> c.getName().equalsIgnoreCase("Investments")).findFirst().orElse(null);

        Category foodCat = allCategories.stream().filter(c -> c.getName().equalsIgnoreCase("Food")).findFirst().orElse(null);
        Category groceryCat = allCategories.stream().filter(c -> c.getName().equalsIgnoreCase("Groceries")).findFirst().orElse(null);
        Category rentCat = allCategories.stream().filter(c -> c.getName().equalsIgnoreCase("Rent")).findFirst().orElse(null);
        Category shopCat = allCategories.stream().filter(c -> c.getName().equalsIgnoreCase("Shopping")).findFirst().orElse(null);
        Category transportCat = allCategories.stream().filter(c -> c.getName().equalsIgnoreCase("Transportation")).findFirst().orElse(null);
        Category entertainCat = allCategories.stream().filter(c -> c.getName().equalsIgnoreCase("Entertainment")).findFirst().orElse(null);
        Category utilCat = allCategories.stream().filter(c -> c.getName().equalsIgnoreCase("Utilities")).findFirst().orElse(null);

        PaymentMethod upi = allPaymentMethods.stream().filter(pm -> pm.getName().equalsIgnoreCase("UPI")).findFirst().orElse(null);
        PaymentMethod card = allPaymentMethods.stream().filter(pm -> pm.getName().equalsIgnoreCase("Credit Card")).findFirst().orElse(null);
        PaymentMethod bank = allPaymentMethods.stream().filter(pm -> pm.getName().equalsIgnoreCase("Bank Transfer")).findFirst().orElse(null);
        PaymentMethod cash = allPaymentMethods.stream().filter(pm -> pm.getName().equalsIgnoreCase("Cash")).findFirst().orElse(null);

        LocalDate today = LocalDate.now();

        // 1. Incomes over last 30 days
        createIncome("Monthly Tech Salary", BigDecimal.valueOf(85000), salaryCat, today.minusDays(25), "Direct salary deposit");
        createIncome("Freelance UI Design", BigDecimal.valueOf(28000), freelanceCat, today.minusDays(18), "Client web landing redesign");
        createIncome("Consulting Stipend", BigDecimal.valueOf(15000), businessCat, today.minusDays(10), "Quarterly technical consulting");
        createIncome("Mutual Fund Dividend", BigDecimal.valueOf(4500), investCat, today.minusDays(3), "Nifty Index Fund dividend payout");

        // 2. Expenses over last 30 days matching realistic categories and payment methods
        createExpense("Apartment Monthly Rent", BigDecimal.valueOf(25000), rentCat, bank, today.minusDays(26), "Home rent via Net Banking");
        createExpense("Organic Supermarket Restock", BigDecimal.valueOf(6450), groceryCat, card, today.minusDays(24), "Weekly organic vegetables and pantry restock");
        createExpense("Electricity & Fiber Internet", BigDecimal.valueOf(3200), utilCat, upi, today.minusDays(22), "Monthly utilities and WiFi bill");
        createExpense("Fuel & Metro Pass", BigDecimal.valueOf(2800), transportCat, upi, today.minusDays(20), "Fuel refill and monthly metro recharge");
        createExpense("Dinner at Olive Bistro", BigDecimal.valueOf(3400), foodCat, card, today.minusDays(17), "Weekend family dinner");
        createExpense("Nike Running Shoes", BigDecimal.valueOf(7999), shopCat, card, today.minusDays(14), "Nike Air Zoom running sneakers");
        createExpense("Gourmet Groceries Restock", BigDecimal.valueOf(4100), groceryCat, upi, today.minusDays(11), "Mid-month groceries");
        createExpense("Streaming Subscriptions", BigDecimal.valueOf(1499), entertainCat, card, today.minusDays(8), "Netflix & Spotify annual renewal");
        createExpense("Weekend Brunch & Cafe", BigDecimal.valueOf(1850), foodCat, upi, today.minusDays(5), "Artisanal coffee and brunch");
        createExpense("Airport Uber & Cab", BigDecimal.valueOf(1250), transportCat, upi, today.minusDays(2), "Cab ride to international airport");
        createExpense("Team Lunch Payout", BigDecimal.valueOf(2200), foodCat, cash, today, "Casual team outing lunch");
    }

    private void createIncome(String title, BigDecimal amount, Category cat, LocalDate date, String desc) {
        Income inc = new Income();
        inc.setTitle(title);
        inc.setAmount(amount);
        inc.setCategory(cat);
        inc.setDate(date);
        inc.setDescription(desc);
        incomeRepository.save(inc);
    }

    private void createExpense(String title, BigDecimal amount, Category cat, PaymentMethod pm, LocalDate date, String desc) {
        Expense exp = new Expense();
        exp.setTitle(title);
        exp.setAmount(amount);
        exp.setCategory(cat);
        exp.setPaymentMethod(pm);
        exp.setDate(date);
        exp.setDescription(desc);
        expenseRepository.save(exp);
    }
}

