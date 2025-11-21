-- GroupCart schema.

DROP TABLE IF EXISTS Favor;
DROP TABLE IF EXISTS ListItem;
DROP TABLE IF EXISTS AppUser;
DROP TABLE IF EXISTS UserGroup;

CREATE TABLE UserGroup (
    ID STRING PRIMARY KEY,
    name VARCHAR(64) NOT NULL
);

CREATE TABLE AppUser (
    ID INTEGER PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    password VARCHAR(32) NULL,
    firstName VARCHAR(64) NOT NULL,
    lastName VARCHAR(64) NOT NULL,
    color CHAR(6) NULL,
    groupID INTEGER NULL REFERENCES UserGroup(ID)
);

CREATE TABLE ListItem (
    ID INTEGER PRIMARY KEY,
    itemName VARCHAR(64) NOT NULL,
    priority INTEGER NOT NULL,
    added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    userID INTEGER NOT NULL REFERENCES AppUser(ID)
);

CREATE TABLE Favor (
    ID INTEGER PRIMARY KEY,
    amount REAL NOT NULL,
    reimbursed TIMESTAMP NULL,
    byUserID INTEGER NOT NULL REFERENCES AppUser(ID),
    forUserID INTEGER NOT NULL REFERENCES AppUser(ID),
    itemID INTEGER UNIQUE NOT NULL REFERENCES ListItem(ID)
);

-- Test data.

INSERT INTO UserGroup VALUES ('dev-team', 'GroupCart Dev Team');

INSERT INTO AppUser (ID, username, firstName, lastName, groupID)
VALUES
    (0, 'abyle', 'Adam', 'Byle', 0),
    (1, 'nroberts', 'Nick', 'Roberts', 0),
    (2, 'aabdullahi', 'Aisha', 'Abdullahi', 0),
    (3, 'fnsengiyumva', 'Faith', 'Nsengiyumva', 0),
    (4, 'gcosta', 'Guli', 'Costa', 0);

INSERT INTO ListItem (ID, itemName, priority, userID) VALUES
    (0, 'Milk', 2, 0),
    (1, 'Bread', 1, 0),
    (2, 'Eggs', 3, 0),

    (3, 'Eggs', 2, 1),
    (4, 'Cereal', 1, 1),
    (5, 'Coffee', 2, 1),

    (6, 'Apples', 1, 2),
    (7, 'Milk', 2, 2),
    (8, 'Toothpaste', 3, 2),

    (9, 'Juice', 2, 3),
    (10, 'Bread', 3, 3),
    (11, 'Laundry Detergent', 1, 3),

    (12, 'Cereal', 1, 4),
    (13, 'Paper Towels', 2, 4),
    (14, 'Milk', 3, 4);

INSERT INTO Favor (ID, amount, reimbursed, byUserID, forUserID, itemID) VALUES
    (0, 4.25, NULL, 0, 1, 3),     -- Adam bought Eggs for Nick
    (1, 3.10, '2025-10-31 14:32:00', 2, 0, 0), -- Aisha reimbursed Adam for Milk
    (2, 7.80, NULL, 1, 4, 12),    -- Nick bought Cereal for Guli
    (3, 2.50, NULL, 4, 3, 10);    -- Guli bought Bread for Faith
