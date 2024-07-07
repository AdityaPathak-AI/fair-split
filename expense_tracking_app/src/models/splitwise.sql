CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(100),
    token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE Room (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES User(user_id)
);

CREATE TABLE Room_Members (
    room_id INT,
    user_id INT,
    PRIMARY KEY (room_id, user_id),
    FOREIGN KEY (room_id) REFERENCES Room(room_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE Expense (
    expense_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payer_id INT NOT NULL,
    room_id INT NOT NULL,
    expense_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payer_id) REFERENCES User(user_id),
    FOREIGN KEY (room_id) REFERENCES `Room`(room_id) ON DELETE CASCADE
);

CREATE TABLE Transaction (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    payer_id INT NOT NULL,
    payee_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    expense_id INT NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payer_id) REFERENCES User(user_id),
    FOREIGN KEY (payee_id) REFERENCES User(user_id),
    FOREIGN KEY (expense_id) REFERENCES Expense(expense_id) ON DELETE CASCADE
);

DELIMITER //

CREATE PROCEDURE GetCreditDebit(
    IN user_id INT,
    IN mem_id INT,
    IN room_id INT
)
BEGIN
    SELECT 
        SUM(CASE WHEN t.payer_id = user_id AND t.payee_id = mem_id THEN t.amount ELSE 0 END) AS credit,
        SUM(CASE WHEN t.payer_id = mem_id AND t.payee_id = user_id THEN t.amount ELSE 0 END) AS debit
    FROM Transaction t 
    WHERE 
        t.expense_id IN (SELECT expense_id FROM Expense WHERE room_id = room_id);
END //

DELIMITER ;

