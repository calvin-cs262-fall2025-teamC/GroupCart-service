-- Get all users
SELECT * FROM AppUser;

-- Get all list items
SELECT itemName, priority FROM ListItem;

-- Get all groups
SELECT name FROM UserGroup;

-- Find a specific user by username
SELECT firstName, lastName FROM AppUser WHERE username = 'abyle';

-- Get high priority items (priority 1)
SELECT itemName, userID FROM ListItem WHERE priority = 1;

-- Get unreimbursed favors
SELECT amount, byUserID, forUserID FROM Favor WHERE reimbursed IS NULL;

-- Get items added by a specific user
SELECT itemName, priority FROM ListItem WHERE userID = 0;

-- Get all items sorted by priority
SELECT itemName, priority FROM ListItem ORDER BY priority;

-- Get users sorted by last name
SELECT firstName, lastName, username FROM AppUser ORDER BY lastName;

-- Get favors sorted by amount (highest first)
SELECT amount, byUserID, forUserID FROM Favor ORDER BY amount DESC;

-- Get items and their user's first name (using WHERE to link tables)
SELECT ListItem.itemName, AppUser.firstName 
FROM ListItem, AppUser 
WHERE ListItem.userID = AppUser.ID;

-- Get favor details with usernames
SELECT Favor.amount, AppUser.username
FROM Favor, AppUser
WHERE Favor.byUserID = AppUser.ID;

-- Get users and their group name
SELECT AppUser.username, UserGroup.name
FROM AppUser, UserGroup
WHERE AppUser.groupID = UserGroup.ID;
