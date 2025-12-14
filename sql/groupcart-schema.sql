-- GroupCart schema.

DROP TABLE IF EXISTS Favor;
DROP TABLE IF EXISTS ListItem;
DROP TABLE IF EXISTS AppUser;
DROP TABLE IF EXISTS UserGroup;

CREATE TABLE UserGroup (
    ID VARCHAR(64) PRIMARY KEY,
    name VARCHAR(64) NOT NULL
);

CREATE TABLE AppUser (
    ID SERIAL PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    password VARCHAR(32) NULL,
    firstName VARCHAR(64) NOT NULL,
    lastName VARCHAR(64) NOT NULL,
    color CHAR(6) NULL,
    groupID VARCHAR(64) NULL REFERENCES UserGroup(ID)
);

CREATE TABLE ListItem (
    ID SERIAL PRIMARY KEY,
    itemName VARCHAR(64) NOT NULL,
    priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 3),
    added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    userID INTEGER NOT NULL REFERENCES AppUser(ID)
);

CREATE TABLE Favor (
    ID SERIAL PRIMARY KEY,
    amount REAL NOT NULL,
    fulfilled TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reimbursed TIMESTAMP NULL,
    byUserID INTEGER NOT NULL REFERENCES AppUser(ID),
    forUserID INTEGER NOT NULL REFERENCES AppUser(ID),
    itemID INTEGER UNIQUE NOT NULL REFERENCES ListItem(ID)
);

-- Test data.

INSERT INTO UserGroup VALUES ('dev-team', 'GroupCart Dev Team');

INSERT INTO AppUser (username, firstName, lastName, groupID)
VALUES
    ('abyle', 'Adam', 'Byle', 'dev-team'),
    ('nroberts', 'Nick', 'Roberts', 'dev-team'),
    ('aabdullahi', 'Aisha', 'Abdullahi', 'dev-team'),
    ('fnsengiyumva', 'Faith', 'Nsengiyumva', 'dev-team'),
    ('gcosta', 'Guli', 'Costa', 'dev-team');

INSERT INTO ListItem (itemName, priority, userID) VALUES
    ('Milk', 2, 1),
    ('Bread', 1, 1),
    ('Eggs', 3, 1),

    ('Eggs', 2, 2),
    ('Cereal', 1, 2),
    ('Coffee', 2, 2),

    ('Apples', 1, 3),
    ('Milk', 2, 3),
    ('Toothpaste', 3, 3),

    ('Juice', 2, 4),
    ('Bread', 3, 4),
    ('Laundry Detergent', 1, 4),

    ('Cereal', 1, 5),
    ('Paper Towels', 2, 5),
    ('Milk', 3, 5);

INSERT INTO Favor (amount, reimbursed, byUserID, forUserID, itemID) VALUES
    (4.25, NULL, 1, 2, 4),     -- Adam bought Eggs for Nick
    (3.10, '2025-10-31 14:32:00', 3, 1, 1), -- Aisha reimbursed Adam for Milk
    (7.80, NULL, 2, 5, 13),    -- Nick bought Cereal for Guli
    (2.50, NULL, 5, 4, 11);    -- Guli bought Bread for Faith
