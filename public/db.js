let db;

// Connection to new Database
const request = indexedDB.open('budget_tracker', 1);



// listen for app coming back online
window.addEventListener('online', uploadTransaction);