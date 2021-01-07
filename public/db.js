const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

    
//save to indexedDB
    let db;
    const request = indexedDB.open("budget", 1);
    
    request.onupgradeneeded = ({
        target
    }) => {
        let db = target.result;
        db.createObjectStore("pending", {
            autoIncrement: true
        });
    };
    
    request.onsuccess = ({
        target
    }) => {
        db = target.result;
        if (navigator.onLine) {
            checkDatabase();
        }
    };
    
    request.onerror = function (event) {
        console.log("Error Code")
    };
// using the funtion saveRecord to save, access and record the data
    function saveRecord(data) {
        const transaction = db.transaction(["pending"], "readwrite");
        //access
        const store = transaction.objectStore("pending");
        //add record
        store.add(data);
    }
    //checking the database to help start the transaction,
    function checkDatabase() {
        //start transaction
        const transaction = db.transaction(["pending"], "readwrite");
        //access pending records
        const store = transaction.objectStore("pending");
        //getting all the record from the store
        const getAll = store.getAll();
    
        getAll.onsuccess = function () {
            if (getAll.result.length > 0) {
                fetch("/api/transaction/bulk", {
                        method: "POST",
                        body: JSON.stringify(getAll.result),
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        }
                    })
                    .then(response => response.json())
                    .then(() => {
                        const transaction = db.transaction(["pending"], "readwrite");
                        const store = transaction.objectStore("pending");
                        store.clear();
                    });
            }
        };
    
    };
    
    window.addEventListener("online", checkDatabase);