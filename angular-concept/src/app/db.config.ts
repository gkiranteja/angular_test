// export var openDatabase = require('websql');
let win = (window as any)
export var db = win.openDatabase("trasers.db", '1.0', "Trasers local database", 5 * 1024 * 1024);

// var create_users_reports = function() {
//     db.transaction(function (tx) {
//         tx.executeSql("CREATE TABLE IF NOT EXISTS users_reports (id integer primary key auto_increment, uid text, nid text, expiry_date date)");
//     });
// }

// var create_pages = function() {
//     db.transaction(function (tx) {
//         tx.executeSql("CREATE TABLE IF NOT EXISTS reports_pages (id integer primary key auto_increment, rid integer, fid integer)");
//     });
// }

export var create_notes = function() {
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS notes (uid integer, nid integer, fid integer, notes text, is_edited tinyint, is_synced tinyint, created_date datetime, created_by text)");
    });
}

export var create_feedbacks = function() {
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS feedbacks (uid integer, nid integer, fid integer, feedbacks text, is_edited tinyint, is_synced tinyint, created_date datetime, created_by text)");
    });
}

export var create_cn = function() {
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS contribute_notes (uid integer, nid integer, fid integer, category text, contribute_notes text, is_edited tinyint, is_synced tinyint, created_date datetime, created_by text)");
    });
}

export var create_cr = function() {
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS custom_research (uid integer, nid integer, fid integer, custom_research text, is_edited tinyint, is_synced tinyint, created_date datetime, created_by text)");
    });
}
