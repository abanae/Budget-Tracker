let db;
// Connection to new Database
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
  };
//Established a upon success
  request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
      checkDatabase();
    }
  };

//Upon error
  request.onerror = function (event) {
    console.log("There was an error " + event.target.errorCode);
  };
  // Save failed post transaction
  function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
  }
  // Online will send failed post transaction
  function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();
  // Getting all transaction, if anything in it,it will run all fetch calls
    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then(() => {
            const transaction = db.transaction(["pending"], "readwrite");
            const store = transaction.objectStore("pending");
  // Clear database 
            store.clear();
          });
      }
    };
  }
  // if online it willl check online
  window.addEventListener("online", checkDatabase);