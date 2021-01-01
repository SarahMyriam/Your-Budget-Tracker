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