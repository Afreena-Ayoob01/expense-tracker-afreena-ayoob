# Expense Tracker

A simple and responsive web application for managing personal income and expenses. Users can add, edit, delete, and filter transactions while keeping track of their overall financial balance.

The application stores transaction data in the browser using `localStorage`, so the data remains available even after refreshing the page.

## Features

* Add income and expense transactions
* Enter transaction amount, category, date, and description
* Edit existing transactions
* Delete transactions
* View total income
* View total expenses
* View current balance
* Filter transactions by type
* Filter transactions by category
* Store transactions using browser `localStorage`
* Monthly expense summary
* Category-wise expense chart
* Input validation
* Responsive design for desktop and mobile devices

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Chart.js
* Browser Local Storage

## Project Structure

```text
expense-tracker-afreena/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## How It Works

### Adding a Transaction

The user enters:

* Transaction type — Income or Expense
* Amount
* Category
* Date
* Description

When the form is submitted, the transaction is stored as a JavaScript object and added to the transactions array.

### Dashboard

The dashboard automatically calculates and displays:

* Total Income
* Total Expenses
* Current Balance

The balance is calculated using:

```text
Balance = Total Income - Total Expenses
```

### Editing and Deleting

Each transaction has **Edit** and **Delete** buttons.

The Edit option loads the selected transaction into the form so the user can update it.

The Delete option removes the selected transaction after confirmation.

### Filtering

Transactions can be filtered by:

* Income or Expense
* Category

The transaction list updates automatically when a filter is selected.

### Local Storage

The application uses the browser's `localStorage` to save transaction data.

When transaction data changes, it is converted into a JSON string using `JSON.stringify()` and stored in local storage.

When the application loads, the stored data is retrieved using `localStorage.getItem()` and converted back into JavaScript objects using `JSON.parse()`.

This allows transactions to remain available even after refreshing the page.

### Monthly Expense Summary

The application includes a monthly expense summary where the user can select a month and view the total expenses for that month.

### Category-wise Expense Chart

The application uses **Chart.js** to display expenses grouped by category.

For example, expenses can be displayed for categories such as:

* Food
* Travel
* Shopping
* Bills
* Entertainment
* Health

The chart is updated whenever transaction data changes.

## Validation

The application includes basic validation to prevent invalid transaction amounts.

For example, an amount must be greater than zero.

Required fields such as category and date are also validated before submitting the transaction.

## Responsive Design

The application uses CSS media queries to provide a responsive layout.

The interface adapts to different screen sizes, including:

* Desktop
* Tablet
* Mobile

## How to Run

No installation or backend server is required.

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
```

### 2. Open the project folder

```text
expense-tracker-afreena
```

### 3. Open `index.html`

You can open `index.html` directly in a web browser.

Alternatively, you can use the **Live Server** extension in Visual Studio Code.


## Author

**Afreena Ayoob**

Developed as an internship selection task.
