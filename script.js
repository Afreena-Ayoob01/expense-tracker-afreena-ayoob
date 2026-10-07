/* ========================================
DOM ELEMENTS
======================================== */

const transactionForm = document.getElementById("transaction-form");

const transactionType = document.getElementById("transaction-type");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");

const transactionList = document.getElementById("transaction-list");
const emptyState = document.getElementById("empty-state");

const submitButton = document.getElementById("submit-button");
const typeFilter = document.getElementById("type-filter");
const summaryMonthInput =
    document.getElementById("summary-month");

const monthlyExpensesElement =
    document.getElementById("monthly-expenses");
const expenseChartElement =
    document.getElementById("expense-chart");
let expenseChart = null;
const categoryFilter = document.getElementById("category-filter");
const totalIncomeElement = document.getElementById("total-income");
const totalExpensesElement = document.getElementById("total-expenses");
const currentBalanceElement = document.getElementById("current-balance");

/* ========================================
TRANSACTIONS
======================================== */

let transactions = [];

// Stores the ID of the transaction
// currently being edited
let editingTransactionId = null;

/* ========================================
LOAD TRANSACTIONS FROM LOCAL STORAGE
======================================== */

const savedTransactions = localStorage.getItem("transactions");

if (savedTransactions) {
transactions = JSON.parse(savedTransactions);
}

/* ========================================
SAVE TRANSACTIONS
======================================== */

function saveTransactions() {


localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
);

}

/* ========================================
ADD / UPDATE TRANSACTION
======================================== */

transactionForm.addEventListener("submit", function (event) {

// Prevent page refresh
event.preventDefault();


// Get values from the form
const type = transactionType.value;
const amount = Number(amountInput.value);
const category = categoryInput.value;
const date = dateInput.value;
const description = descriptionInput.value.trim();
/* ====================================
   INPUT VALIDATION
==================================== */

if (amount <= 0) {

    alert("Please enter an amount greater than 0.");

    return;
}


/* ====================================
   UPDATE EXISTING TRANSACTION
==================================== */

if (editingTransactionId !== null) {

    const transaction = transactions.find(function (item) {

        return item.id === editingTransactionId;

    });


    if (transaction) {

        transaction.type = type;
        transaction.amount = amount;
        transaction.category = category;
        transaction.date = date;
        transaction.description = description;
    }


    // Exit edit mode
    editingTransactionId = null;

    // Change button back
    submitButton.textContent = "Add Transaction";
}


/* ====================================
   CREATE NEW TRANSACTION
==================================== */

else {

    const transaction = {

        id: Date.now(),

        type: type,

        amount: amount,

        category: category,

        date: date,

        description: description
    };


    // Add transaction to array
    transactions.push(transaction);
}


// Save data
saveTransactions();


// Update transaction list
renderTransactions();


// Update dashboard
updateSummary();

updateMonthlyExpenses();
updateExpenseChart();
// Clear form
transactionForm.reset();


});

/* ========================================
UPDATE SUMMARY
======================================== */

function updateSummary() {

let income = 0;

let expenses = 0;


// Calculate income and expenses
transactions.forEach(function (transaction) {

    if (transaction.type === "income") {

        income += transaction.amount;

    }

    else if (transaction.type === "expense") {

        expenses += transaction.amount;
    }
});


// Calculate balance
const balance = income - expenses;


// Display values
totalIncomeElement.textContent =
    `₹${income.toFixed(2)}`;

totalExpensesElement.textContent =
    `₹${expenses.toFixed(2)}`;

currentBalanceElement.textContent =
    `₹${balance.toFixed(2)}`;

}
/* ========================================
   MONTHLY EXPENSE SUMMARY
======================================== */

function updateMonthlyExpenses() {

    const selectedMonth = summaryMonthInput.value;


    // If no month is selected
    if (!selectedMonth) {

        monthlyExpensesElement.textContent = "₹0.00";

        return;
    }


    // Calculate expenses for selected month
    let monthlyExpenses = 0;


    transactions.forEach(function (transaction) {

        if (
            transaction.type === "expense" &&
            transaction.date.startsWith(selectedMonth)
        ) {

            monthlyExpenses += transaction.amount;
        }
    });


    // Display monthly expenses
    monthlyExpensesElement.textContent =
        `₹${monthlyExpenses.toFixed(2)}`;
}

/* ========================================
   CATEGORY-WISE EXPENSE CHART
======================================== */

/* ========================================
   CATEGORY-WISE EXPENSE CHART
======================================== */

function updateExpenseChart() {

    // Stop if Chart.js is not loaded
    if (typeof Chart === "undefined") {

        console.log("Chart.js is not loaded.");

        return;
    }


    // Stop if canvas element is not found
    if (!expenseChartElement) {

        console.log("Expense chart canvas not found.");

        return;
    }


    const categoryTotals = {};


    // Calculate expenses for each category
    transactions.forEach(function (transaction) {

        if (transaction.type === "expense") {

            if (!categoryTotals[transaction.category]) {

                categoryTotals[transaction.category] = 0;
            }


            categoryTotals[transaction.category] +=
                transaction.amount;
        }
    });


    // Get category names
    const categories = Object.keys(categoryTotals);


    // Get expense amounts
    const amounts = Object.values(categoryTotals);


    // Remove previous chart
    if (expenseChart) {

        expenseChart.destroy();

        expenseChart = null;
    }


    // If there are no expenses, don't create an empty chart
    if (categories.length === 0) {

        return;
    }


    // Create new chart
    expenseChart = new Chart(
        expenseChartElement,
        {
            type: "bar",

            data: {

                labels: categories,

                datasets: [
                    {
                        label: "Expenses",

                        data: amounts
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false
            }
        }
    );
}

/* ========================================
RENDER TRANSACTIONS
======================================== */

function renderTransactions() {

    // Get selected filter values
    const selectedType = typeFilter.value;
    const selectedCategory = categoryFilter.value;


    // Filter transactions
    const filteredTransactions = transactions.filter(function (transaction) {

        const typeMatches =
            selectedType === "all" ||
            transaction.type === selectedType;


        const categoryMatches =
            selectedCategory === "all" ||
            transaction.category === selectedCategory;


        return typeMatches && categoryMatches;
    });


    // Clear current transaction list
    transactionList.innerHTML = "";


    // Show empty state if no transactions match
    if (filteredTransactions.length === 0) {

        transactionList.appendChild(emptyState);

        return;
    }


    // Display filtered transactions
    filteredTransactions.forEach(function (transaction) {

        const transactionCard =
            document.createElement("div");


        transactionCard.classList.add(
            "transaction-card"
        );


        // Decide whether to show + or -
        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        transactionCard.innerHTML = `

            <div>

                <h3>${transaction.category}</h3>

                <p>
                    ${transaction.description || "No description"}
                </p>

                <small>${transaction.date}</small>

            </div>


            <div>

                <strong>
                    ${sign}₹${transaction.amount.toFixed(2)}
                </strong>


                <div class="transaction-actions">

                    <button
                        class="edit-button"
                        onclick="editTransaction(${transaction.id})">
                        Edit
                    </button>


                    <button
                        class="delete-button"
                        onclick="deleteTransaction(${transaction.id})">
                        Delete
                    </button>

                </div>

            </div>
        `;


        transactionList.appendChild(transactionCard);
    });
}


/* ========================================
EDIT TRANSACTION
======================================== */

function editTransaction(id) {

// Find the transaction
const transaction = transactions.find(function (item) {

    return item.id === id;

});


// Stop if transaction doesn't exist
if (!transaction) {

    return;
}


// Put transaction data into form
transactionType.value = transaction.type;

amountInput.value = transaction.amount;

categoryInput.value = transaction.category;

dateInput.value = transaction.date;

descriptionInput.value = transaction.description;


// Store ID being edited
editingTransactionId = id;


// Change button text
submitButton.textContent =
    "Update Transaction";


// Scroll to form
transactionForm.scrollIntoView({
    behavior: "smooth"
});

}

/* ========================================
DELETE TRANSACTION
======================================== */

function deleteTransaction(id) {

// Ask for confirmation
const confirmed = confirm(
    "Are you sure you want to delete this transaction?"
);


// Stop if user cancels
if (!confirmed) {

    return;
}


// Remove transaction
transactions = transactions.filter(function (transaction) {

    return transaction.id !== id;

});


// If deleted transaction was being edited
if (editingTransactionId === id) {

    editingTransactionId = null;

    submitButton.textContent =
        "Add Transaction";

    transactionForm.reset();
}


// Save updated data
saveTransactions();


// Update transaction list
renderTransactions();


// Update dashboard
updateSummary();

updateMonthlyExpenses();
updateExpenseChart();
}

/* ========================================
INITIAL PAGE LOAD
======================================== */

// Display saved transactions
renderTransactions();

// Calculate saved totals
updateSummary();
// Select the current month automatically 
const currentDate = new Date(); 
const currentMonth = currentDate.toISOString().slice(0, 7);
summaryMonthInput.value = currentMonth;
// Calculate monthly expenses
updateMonthlyExpenses();
updateExpenseChart();
/* ========================================
   FILTER TRANSACTIONS
======================================== */

typeFilter.addEventListener("change", function () {

    renderTransactions();

});


categoryFilter.addEventListener("change", function () {

    renderTransactions();

});

summaryMonthInput.addEventListener("change", function () {

    updateMonthlyExpenses();

});


