document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-btn').addEventListener('click', addExpense);

    let totalIncome = 0;
    let totalExpenses = 0;

    function addExpense() {
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const date = document.getElementById('date').value;
        const category = document.getElementById('category').value;

        if (!description || isNaN(amount) || !date) {
            alert('Please enter valid description, amount, and date');
            return;
        }

        const expense = { description, amount, date, category };

        // Send data to Google Apps Script
        sendDataToGoogleAppsScript(expense);

        addExpenseToUI(description, amount, date, category);
        updateSummary();

        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('date').value = '';
    }

    function addExpenseToUI(description, amount, date, category) {
        const expenseItem = document.createElement('li');
        expenseItem.textContent = `${description} - $${amount.toFixed(2)} on ${date}`;
        expenseItem.classList.add(category);

        if (category === 'income') {
            totalIncome += amount;
        } else if (category === 'expense') {
            totalExpenses += amount;
        }

        document.getElementById('expenses-list').appendChild(expenseItem);
    }

    function updateSummary() {
        document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;
        document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
        document.getElementById('net-balance').textContent = `$${(totalIncome - totalExpenses).toFixed(2)}`;
    }

    function sendDataToGoogleAppsScript(data) {
        const url = 'https://script.google.com/macros/s/AKfycbzqtueKI_43ZOCSGSiT7y3XCM-eS1qowE85vRURnGNjWYHz8ziG0vqitTGrHGwh4KE9pQ/exec'; // Replace with your Google Apps Script web app URL
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch(url, options)
            .then(response => response.text())
            .then(data => console.log('Data sent to Google Apps Script:', data))
            .catch(error => console.error('Error sending data to Google Apps Script:', error));
    }
});
