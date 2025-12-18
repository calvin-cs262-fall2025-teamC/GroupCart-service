import { Router, Request, Response } from 'express';
import { IDatabase } from 'pg-promise';

const router = Router();

export const createRouter = (db: IDatabase<any>) => {

    /**
     * @openapi
     * /user/{username}:
     *   post:
     *     summary: Create a new user
     *     description: Create a new user with the given username. Fails if the user already exists.
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: Username for the new user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - firstName
     *               - lastName
     *             properties:
     *               firstName:
     *                 type: string
     *                 description: First name of the user
     *                 example: John
     *               lastName:
     *                 type: string
     *                 description: Last name of the user
     *                 example: Doe
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User created successfully
     *                 username:
     *                   type: string
     *                   example: johndoe
     *                 firstName:
     *                   type: string
     *                   example: John
     *                 lastName:
     *                   type: string
     *                   example: Doe
     *       409:
     *         description: User already exists
     */
    router.post('/user/:username', async (req: Request, res: Response) => {
        const { username } = req.params;
        const { firstName, lastName } = req.body;

        try {
            // Validate input
            if (!firstName || !lastName) {
                return res.status(400).json({ error: 'firstName and lastName are required' });
            }

            // Check if user already exists
            const existing = await db.oneOrNone(
                'SELECT id FROM AppUser WHERE username = $1',
                [username]
            );

            if (existing) {
                return res.status(409).json({ error: 'User already exists' });
            }

            // Insert new user
            const result = await db.one(
                'INSERT INTO AppUser (username, firstName, lastName) VALUES ($1, $2, $3) RETURNING id',
                [username, firstName, lastName]
            );

            res.status(201).json({
                message: 'User created successfully',
                username,
                firstName,
                lastName,
                id: result.id
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @swagger
     * /user/{username}:
     *   put:
     *     summary: Modify user information
     *     description: Update a user's first name, last name, color, and/or group membership.
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: Username of the user to modify
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstName:
     *                 type: string
     *                 description: New first name for the user
     *                 example: Jonathan
     *               lastName:
     *                 type: string
     *                 description: New last name for the user
     *                 example: Smith
     *               groupId:
     *                 type: string
     *                 nullable: true
     *                 description: New group ID for the user (null to remove from group)
     *                 example: dev-team
     *               color:
     *                 nullable: true
     *                 type: string
     *                 description: New color for the user
     *                 example: #ff0000
     *     responses:
     *       200:
     *         description: User modified successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User modified successfully
     *                 username:
     *                   type: string
     *                   example: johndoe
     *                 firstName:
     *                   type: string
     *                   example: Jonathan
     *                 lastName:
     *                   type: string
     *                   example: Smith
     *                 groupId:
     *                   type: string
     *                   nullable: true
     *                   example: dev-team
     *                 color:
     *                   type: string
     *                   example: #ff0000
     *       404:
     *         description: User or group not found
     *       400:
     *         description: At least one field must be provided to update
     */
    router.put('/user/:username', async (req: Request, res: Response) => {
        const { username } = req.params;
        const { firstName, lastName, groupId, color } = req.body;

        try {
            // Validate that at least one field is provided
            if (firstName === undefined && lastName === undefined && groupId === undefined && color == undefined) {
                return res.status(400).json({ error: 'At least one field (firstName, lastName, color, or groupId) must be provided' });
            }

            // Check if user exists
            const user = await db.oneOrNone(
                'SELECT id, firstName, lastName, color, groupID FROM AppUser WHERE username = $1',
                [username]
            );

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // If groupId is provided and not null, verify the group exists
            if (groupId !== undefined && groupId !== null) {
                const group = await db.oneOrNone(
                    'SELECT ID FROM UserGroup WHERE ID = $1',
                    [groupId]
                );

                if (!group) {
                    return res.status(404).json({ error: 'Group not found' });
                }
            }

            // Build update query dynamically based on provided fields
            const updates: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;

            if (firstName !== undefined) {
                updates.push(`firstName = ${paramIndex++}`);
                values.push(firstName);
            }

            if (lastName !== undefined) {
                updates.push(`lastName = ${paramIndex++}`);
                values.push(lastName);
            }

            if (color !== undefined) {
                updates.push(`color = ${paramIndex++}`);
                values.push(color);
            }

            if (groupId !== undefined) {
                updates.push(`groupID = ${paramIndex++}`);
                values.push(groupId);
            }

            values.push(username);

            // Update user
            await db.none(
                `UPDATE AppUser SET ${updates.join(', ')} WHERE username = ${paramIndex}`,
                values
            );

            res.status(200).json({
                message: 'User modified successfully',
                username,
                firstName: firstName !== undefined ? firstName : user.firstname,
                lastName: lastName !== undefined ? lastName : user.lastname,
                color: color !== undefined ? color : user.color,
                groupId: groupId !== undefined ? groupId : user.groupid,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @swagger
     * /user/{username}:
     *   delete:
     *     summary: Delete user account
     *     description: Delete a user account and all associated data. This will delete the user's list items and any favors they have given or received. Note that this is a permanent action and cannot be undone.
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: Username of the user to delete
     *     responses:
     *       200:
     *         description: User deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User deleted successfully
     *                 username:
     *                   type: string
     *                   example: johndoe
     *                 deletedItems:
     *                   type: integer
     *                   description: Number of list items deleted
     *                   example: 5
     *                 deletedFavors:
     *                   type: integer
     *                   description: Number of favors deleted (given or received)
     *                   example: 3
     *       404:
     *         description: User not found
     */
    router.delete('/user/:username', async (req: Request, res: Response) => {
        const { username } = req.params;

        try {
            // Check if user exists and get their ID
            const user = await db.oneOrNone(
                'SELECT id FROM AppUser WHERE username = $1',
                [username]
            );

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Count items and favors for the response
            const itemCount = await db.one(
                'SELECT COUNT(*) as count FROM ListItem WHERE userID = $1',
                [user.id]
            );

            const favorCount = await db.one(
                'SELECT COUNT(*) as count FROM Favor WHERE byUserID = $1 OR forUserID = $1',
                [user.id]
            );

            // Delete favors associated with user's items (CASCADE won't handle this)
            await db.none(
                'DELETE FROM Favor WHERE itemID IN (SELECT id FROM ListItem WHERE userID = $1)',
                [user.id]
            );

            // Delete favors where user was the giver or receiver
            await db.none(
                'DELETE FROM Favor WHERE byUserID = $1 OR forUserID = $1',
                [user.id]
            );

            // Delete user's list items
            await db.none(
                'DELETE FROM ListItem WHERE userID = $1',
                [user.id]
            );

            // Delete user
            await db.none(
                'DELETE FROM AppUser WHERE id = $1',
                [user.id]
            );

            res.status(200).json({
                message: 'User deleted successfully',
                username,
                deletedItems: parseInt(itemCount.count),
                deletedFavors: parseInt(favorCount.count)
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @openapi
     * /user/{username}:
     *   get:
     *     summary: Get user information
     *     description: Get information about a user with the given username.
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: Username to retrieve
     *     responses:
     *       200:
     *         description: User information retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 firstName:
     *                   type: string
     *                   description: First name of the user
     *                   example: John
     *                 lastName:
     *                   type: string
     *                   description: Last name of the user
     *                   example: Doe
     *                 groupId:
     *                   type: string
     *                   nullable: true
     *                   description: ID of the group the user is in, if any
     *                   example: group123
     *       404:
     *         description: User not found
     */
    router.get('/user/:username', async (req: Request, res: Response) => {
        const { username } = req.params;

        try {
            const user = await db.oneOrNone(
                'SELECT firstName, lastName, groupID FROM AppUser WHERE username = $1',
                [username]
            );

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({
                firstName: user.firstname,
                lastName: user.lastname,
                groupId: user.groupid
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @openapi
     * /group/{id}:
     *   post:
     *     summary: Create a new group
     *     description: Create a new group with the given ID. Include a name for the group and users to be in the group (should include user who created the group).
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID for the new group
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *                 description: Display name for the group
     *                 example: Family Grocery Group
     *               users:
     *                 type: array
     *                 items:
     *                   type: string
     *                 nullable: true
     *                 description: Optional users in the group
     *                 example: ["user1", "user2", "user3"]
     *     responses:
     *       201:
     *         description: Group created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Group created successfully
     *                 id:
     *                   type: string
     *                   example: group123
     *                 name:
     *                   type: string
     *                   example: Family Grocery Group
     *                 users:
     *                   type: array
     *                   items:
     *                     type: string
     *                   example: ["user1", "user2", "user3"]
     *       409:
     *         description: Group already exists
     */
    router.post('/group/:id', async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, users } = req.body;

        try {
            // Validate input
            if (!name) {
                return res.status(400).json({ error: 'name is required' });
            }

            // Check if group already exists
            const existing = await db.oneOrNone(
                'SELECT ID FROM UserGroup WHERE ID = $1',
                [id]
            );

            if (existing) {
                return res.status(409).json({ error: 'Group already exists' });
            }

            // Insert new group
            await db.none(
                'INSERT INTO UserGroup (ID, name) VALUES ($1, $2)',
                [id, name]
            );

            // Update users to be in this group if provided
            if (users && users.length > 0) {
                // Verify all users exist
                const existingUsers = await db.any(
                    'SELECT username FROM AppUser WHERE username = ANY($1)',
                    [users]
                );

                if (existingUsers.length !== users.length) {
                    return res.status(404).json({ error: 'One or more users not found' });
                }

                await db.none(
                    'UPDATE AppUser SET groupID = $1 WHERE username = ANY($2)',
                    [id, users]
                );
            }

            res.status(201).json({
                message: 'Group created successfully',
                id,
                name,
                users: users || []
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @openapi
     * /group/{id}:
     *   get:
     *     summary: Get group information
     *     description: Get information about a group with the given ID.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Group ID to retrieve
     *     responses:
     *       200:
     *         description: Group information retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 name:
     *                   type: string
     *                   description: Display name for the group
     *                   example: Family Grocery Group
     *                 users:
     *                   type: array
     *                   items:
     *                     type: string
     *                   description: Usernames of users in the group
     *                   example: ["user1", "user2", "user3"]
     *                 userColors:
     *                   type: object
     *                   additionalProperties:
     *                     type: string
     *                   description: User display colors
     *                   example: {"user1": "#FF5733", "user2": "#33FF57", "user3": "#3357FF"}
     *       404:
     *         description: Group not found
     */
    router.get('/group/:id', async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const group = await db.oneOrNone(
                'SELECT name FROM UserGroup WHERE ID = $1',
                [id]
            );

            if (!group) {
                return res.status(404).json({ error: 'Group not found' });
            }

            // Get users in this group
            const users = await db.any(
                'SELECT username, color FROM AppUser WHERE groupID = $1',
                [id]
            );

            const userColors: { [key: string]: string } = {};
            const usernames = users.map(u => {
                if (u.color) {
                    userColors[u.username] = '#' + u.color;
                }
                return u.username;
            });

            res.status(200).json({
                name: group.name,
                users: usernames,
                userColors
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @openapi
     * /list/{username}:
     *   get:
     *     summary: Get user's grocery list
     *     description: Get the items in a user's personal grocery list.
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: Username whose list to retrieve
     *     responses:
     *       200:
     *         description: Grocery list retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     description: Globally unique identifier for this list item
     *                     example: 1
     *                   item:
     *                     type: string
     *                     description: The name of the item
     *                     example: Milk
     *                   priority:
     *                     type: integer
     *                     minimum: 1
     *                     maximum: 3
     *                     description: The priority level of this item (1-3)
     *                     example: 1
     *                   added:
     *                     type: string
     *                     format: date-time
     *                     description: The time this item was added to the grocery list
     *                     example: "2025-10-25T10:00:00Z"
     *                   fulfilled:
     *                     type: boolean
     *                     description: Whether another user has bought this item for the user
     *                     example: false
     *                   fulfilledBy:
     *                     type: string
     *                     nullable: true
     *                     description: If fulfilled, the username who fulfilled the item
     *                     example: user2
     *                   fulfilledAt:
     *                     type: string
     *                     format: date-time
     *                     nullable: true
     *                     description: If fulfilled, the time the item was fulfilled
     *                     example: "2025-10-26T09:00:00Z"
     *                   favorId:
     *                     type: integer
     *                     nullable: true
     *                     description: If fulfilled, the ID of the favor
     *                     example: 5
     *       404:
     *         description: User not found
     */
    router.get('/list/:username', async (req: Request, res: Response) => {
        const { username } = req.params;

        try {
            // Get user ID
            const user = await db.oneOrNone(
                'SELECT id FROM AppUser WHERE username = $1',
                [username]
            );

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Get list items with favor information
            const items = await db.any(`
                SELECT 
                    li.id,
                    li.itemName as item,
                    li.priority,
                    li.added,
                    CASE WHEN f.id IS NOT NULL THEN true ELSE false END as fulfilled,
                    u.username as fulfilledBy,
                    f.fulfilled as fulfilledAt,
                    f.id as favorId
                FROM ListItem li
                LEFT JOIN Favor f ON li.id = f.itemID
                LEFT JOIN AppUser u ON f.byUserID = u.id
                WHERE li.userID = $1
                ORDER BY li.priority, li.added
            `, [user.id]);

            const formattedItems = items.map(item => ({
                id: item.id,
                item: item.item,
                priority: item.priority,
                added: item.added,
                fulfilled: item.fulfilled,
                fulfilledBy: item.fulfilledby || null,
                fulfilledAt: item.fulfilledat || null,
                favorId: item.favorid || null
            }));

            res.status(200).json(formattedItems);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @openapi
     * /list/{username}:
     *   post:
     *     summary: Add item to grocery list
     *     description: Add an item to a user's personal grocery list.
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: Username whose list to add to
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - item
     *               - priority
     *             properties:
     *               item:
     *                 type: string
     *                 description: The name of the item
     *                 example: Bananas
     *               priority:
     *                 type: integer
     *                 minimum: 1
     *                 maximum: 3
     *                 description: The priority level of this item (1-3)
     *                 example: 2
     *     responses:
     *       201:
     *         description: Item added successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Item added successfully
     *                 id:
     *                   type: integer
     *                   example: 123
     *                 item:
     *                   type: string
     *                   example: Bananas
     *                 priority:
     *                   type: integer
     *                   example: 2
     *                 added:
     *                   type: string
     *                   format: date-time
     *                   example: "2025-10-26T12:00:00Z"
     *       404:
     *         description: User not found
     */
    router.post('/list/:username', async (req: Request, res: Response) => {
        const { username } = req.params;
        const { item, priority } = req.body;

        try {
            // Validate input
            if (!item) {
                return res.status(400).json({ error: 'item is required' });
            }

            if (!priority || priority < 1 || priority > 3) {
                return res.status(400).json({ error: 'priority must be between 1 and 3' });
            }

            // Get user ID
            const user = await db.oneOrNone(
                'SELECT id FROM AppUser WHERE username = $1',
                [username]
            );

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Insert item
            const result = await db.one(
                'INSERT INTO ListItem (itemName, priority, userID) VALUES ($1, $2, $3) RETURNING id, added',
                [item, priority, user.id]
            );

            res.status(201).json({
                message: 'Item added successfully',
                id: result.id,
                item,
                priority,
                added: result.added
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @openapi
     * /list/{username}/{id}:
     *   put:
     *     summary: Modify grocery list item
     *     description: Modify an item in a user's personal grocery list.
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: Username whose list to modify
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the item to modify
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - item
     *               - priority
     *             properties:
     *               item:
     *                 type: string
     *                 description: The name of the item
     *                 example: Whole Milk
     *               priority:
     *                 type: integer
     *                 minimum: 1
     *                 maximum: 3
     *                 description: The priority level of this item (1-3)
     *                 example: 1
     *     responses:
     *       200:
     *         description: Item modified successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Item modified successfully
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 item:
     *                   type: string
     *                   example: Whole Milk
     *                 priority:
     *                   type: integer
     *                   example: 1
     *       404:
     *         description: User or item not found
     */
    router.put('/list/:username/:id', async (req: Request, res: Response) => {
        const { username, id } = req.params;
        const { item, priority } = req.body;

        try {
            // Validate input
            if (!item) {
                return res.status(400).json({ error: 'item is required' });
            }

            if (!priority || priority < 1 || priority > 3) {
                return res.status(400).json({ error: 'priority must be between 1 and 3' });
            }

            // Verify user owns this item
            const existing = await db.oneOrNone(`
                SELECT li.id 
                FROM ListItem li
                JOIN AppUser u ON li.userID = u.id
                WHERE li.id = $1 AND u.username = $2
            `, [id, username]);

            if (!existing) {
                return res.status(404).json({ error: 'User or item not found' });
            }

            // Update item
            await db.none(
                'UPDATE ListItem SET itemName = $1, priority = $2 WHERE id = $3',
                [item, priority, id]
            );

            res.status(200).json({
                message: 'Item modified successfully',
                id: parseInt(id),
                item,
                priority
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @openapi
     * /list/{username}/{id}:
     *   delete:
     *     summary: Delete grocery list item
     *     description: Delete the specified item from the user's personal grocery list.
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: Username whose list to delete from
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the item to delete
     *     responses:
     *       200:
     *         description: Item deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Item deleted successfully
     *                 id:
     *                   type: integer
     *                   example: 1
     *       404:
     *         description: User or item not found
     */
    router.delete('/list/:username/:id', async (req: Request, res: Response) => {
        const { username, id } = req.params;

        try {
            // Verify user owns this item
            const existing = await db.oneOrNone(`
                SELECT li.id 
                FROM ListItem li
                JOIN AppUser u ON li.userID = u.id
                WHERE li.id = $1 AND u.username = $2
            `, [id, username]);

            if (!existing) {
                return res.status(404).json({ error: 'User or item not found' });
            }

            // Delete associated favor first (if exists)
            await db.none('DELETE FROM Favor WHERE itemID = $1', [id]);

            // Delete item
            await db.none('DELETE FROM ListItem WHERE id = $1', [id]);

            res.status(200).json({
                message: 'Item deleted successfully',
                id: parseInt(id)
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @openapi
     * /favors/for/{username}:
     *   get:
     *     summary: Get favors fulfilled for user
     *     description: Get the favors fulfilled for a particular user.
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: Username to get favors for
     *     responses:
     *       200:
     *         description: Favors retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     description: The unique identifier of the favor
     *                     example: 5
     *                   itemId:
     *                     type: integer
     *                     description: The ID of the item
     *                     example: 2
     *                   item:
     *                     type: string
     *                     description: The name of the item
     *                     example: Bread
     *                   fulfilledAt:
     *                     type: string
     *                     format: date-time
     *                     description: The time the favor was fulfilled
     *                     example: "2025-10-26T09:00:00Z"
     *                   by:
     *                     type: string
     *                     description: The user the favor was fulfilled by
     *                     example: user2
     *                   reimbursed:
     *                     type: boolean
     *                     description: Whether the doer of the favor has been reimbursed
     *                     example: false
     *                   reimbursedAt:
     *                     type: string
     *                     format: date-time
     *                     nullable: true
     *                     description: When the doer of the favor was reimbursed (if reimbursed)
     *                     example: "2025-10-26T10:00:00Z"
     *                   amount:
     *                     type: number
     *                     description: How much the doer of the favor is owed
     *                     example: 3.50
     *       404:
     *         description: User not found
     */
    router.get('/favors/for/:username', async (req: Request, res: Response) => {
        const { username } = req.params;

        try {
            const user = await db.oneOrNone(
                'SELECT id FROM AppUser WHERE username = $1',
                [username]
            );

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const favors = await db.any(`
                SELECT 
                    f.id,
                    f.itemID,
                    li.itemName as item,
                    f.fulfilled as fulfilledAt,
                    u.username as by,
                    CASE WHEN f.reimbursed IS NOT NULL THEN true ELSE false END as reimbursed,
                    f.reimbursed as reimbursedAt,
                    f.amount
                FROM Favor f
                JOIN ListItem li ON f.itemID = li.id
                JOIN AppUser u ON f.byUserID = u.id
                WHERE f.forUserID = $1
                ORDER BY f.fulfilled DESC
            `, [user.id]);

            const formattedFavors = favors.map(favor => ({
                id: favor.id,
                itemId: favor.itemid,
                item: favor.item,
                fulfilledAt: favor.fulfilledat,
                by: favor.by,
                reimbursed: favor.reimbursed,
                reimbursedAt: favor.reimbursedat,
                amount: favor.amount
            }));

            res.status(200).json(formattedFavors);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @openapi
     * /favors/by/{username}:
     *   get:
     *     summary: Get favors fulfilled by user
     *     description: Get the favors fulfilled by a user for other users.
     *     parameters:
     *       - in: path
     *         name: username
     *         required: true
     *         schema:
     *           type: string
     *         description: Username who fulfilled the favors
     *     responses:
     *       200:
     *         description: Favors retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     description: The unique identifier of the favor
     *                     example: 6
     *                   itemId:
     *                     type: integer
     *                     description: The ID of the item
     *                     example: 3
     *                   item:
     *                     type: string
     *                     description: The name of the item
     *                     example: Cheese
     *                   fulfilledAt:
     *                     type: string
     *                     format: date-time
     *                     description: The time the favor was fulfilled
     *                     example: "2025-10-26T08:00:00Z"
     *                   for:
     *                     type: string
     *                     description: The user the favor was fulfilled for
     *                     example: user1
     *                   reimbursed:
     *                     type: boolean
     *                     description: Whether the doer of the favor has been reimbursed
     *                     example: false
     *                   reimbursedAt:
     *                     type: string
     *                     format: date-time
     *                     nullable: true
     *                     description: When the doer of the favor was reimbursed (if reimbursed)
     *                     example: "2025-10-26T11:00:00Z"
     *                   amount:
     *                     type: number
     *                     description: How much the doer of the favor is owed
     *                     example: 5.99
     *       404:
     *         description: User not found
     */
    router.get('/favors/by/:username', async (req: Request, res: Response) => {
        const { username } = req.params;

        try {
            const user = await db.oneOrNone(
                'SELECT id FROM AppUser WHERE username = $1',
                [username]
            );

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const favors = await db.any(`
                SELECT 
                    f.id,
                    f.itemID,
                    li.itemName as item,
                    f.fulfilled as fulfilledAt,
                    u.username as "for",
                    CASE WHEN f.reimbursed IS NOT NULL THEN true ELSE false END as reimbursed,
                    f.reimbursed as reimbursedAt,
                    f.amount
                FROM Favor f
                JOIN ListItem li ON f.itemID = li.id
                JOIN AppUser u ON f.forUserID = u.id
                WHERE f.byUserID = $1
                ORDER BY f.fulfilled DESC
            `, [user.id]);

            const formattedFavors = favors.map(favor => ({
                id: favor.id,
                itemId: favor.itemid,
                item: favor.item,
                fulfilledAt: favor.fulfilledat,
                for: favor.for,
                reimbursed: favor.reimbursed,
                reimbursedAt: favor.reimbursedat,
                amount: favor.amount
            }));

            res.status(200).json(formattedFavors);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @openapi
     * /favor:
     *   post:
     *     summary: Mark favor as fulfilled
     *     description: Mark a favor as fulfilled by the given user.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - itemId
     *               - item
     *               - by
     *               - for
     *               - amount
     *             properties:
     *               itemId:
     *                 type: integer
     *                 description: The ID of the item
     *                 example: 15
     *               item:
     *                 type: string
     *                 description: The name of the item
     *                 example: Orange Juice
     *               by:
     *                 type: string
     *                 description: The user the favor is done by
     *                 example: user2
     *               for:
     *                 type: string
     *                 description: The user the favor is for
     *                 example: user1
     *               amount:
     *                 type: number
     *                 description: How much the doer of the favor is owed
     *                 example: 4.50
     *     responses:
     *       201:
     *         description: Favor marked as fulfilled successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Favor marked as fulfilled
     *                 id:
     *                   type: integer
     *                   example: 15
     *                 itemId:
     *                   type: integer
     *                   example: 15
     *                 item:
     *                   type: string
     *                   example: Orange Juice
     *                 by:
     *                   type: string
     *                   example: user2
     *                 for:
     *                   type: string
     *                   example: user1
     *                 amount:
     *                   type: number
     *                   example: 4.50
     *                 fulfilledAt:
     *                   type: string
     *                   format: date-time
     *                   example: "2025-10-26T12:00:00Z"
     *                 reimbursed:
     *                   type: boolean
     *                   example: false
     *       404:
     *         description: User or item not found
     */
    router.post('/favor', async (req: Request, res: Response) => {
        const { itemId, item, by, for: forUser, amount } = req.body;

        try {
            // Validate input
            if (!itemId || !by || !forUser || amount === undefined) {
                return res.status(400).json({ error: 'itemId, by, for, and amount are required' });
            }

            // Get user IDs
            const byUserData = await db.oneOrNone(
                'SELECT id FROM AppUser WHERE username = $1',
                [by]
            );
            const forUserData = await db.oneOrNone(
                'SELECT id FROM AppUser WHERE username = $1',
                [forUser]
            );

            if (!byUserData || !forUserData) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Verify item exists and belongs to forUser
            const itemData = await db.oneOrNone(
                'SELECT id, itemName FROM ListItem WHERE id = $1 AND userID = $2',
                [itemId, forUserData.id]
            );

            if (!itemData) {
                return res.status(404).json({ error: 'Item not found or does not belong to the specified user' });
            }

            // Check if favor already exists for this item
            const existingFavor = await db.oneOrNone(
                'SELECT id FROM Favor WHERE itemID = $1',
                [itemId]
            );

            if (existingFavor) {
                return res.status(409).json({ error: 'Favor already exists for this item' });
            }

            // Insert favor
            const result = await db.one(
                'INSERT INTO Favor (amount, byUserID, forUserID, itemID) VALUES ($1, $2, $3, $4) RETURNING id, fulfilled',
                [amount, byUserData.id, forUserData.id, itemId]
            );

            res.status(201).json({
                message: 'Favor marked as fulfilled',
                id: result.id,
                itemId,
                item: item || itemData.itemname,
                by,
                for: forUser,
                amount,
                fulfilledAt: result.fulfilled,
                reimbursed: false
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @openapi
     * /favor/{id}:
     *   put:
     *     summary: Update favor details
     *     description: Change a favor's reimbursement status or amount.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the favor to update
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - reimbursed
     *               - amount
     *             properties:
     *               reimbursed:
     *                 type: boolean
     *                 description: Whether the doer of the favor has been reimbursed
     *                 example: true
     *               amount:
     *                 type: number
     *                 description: How much the doer of the favor is owed
     *                 example: 5.99
     *     responses:
     *       200:
     *         description: Favor updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Favor updated successfully
     *                 id:
     *                   type: integer
     *                   example: 5
     *                 reimbursed:
     *                   type: boolean
     *                   example: true
     *                 amount:
     *                   type: number
     *                   example: 5.99
     *                 reimbursedAt:
     *                   type: string
     *                   format: date-time
     *                   nullable: true
     *                   example: "2025-10-26T12:00:00Z"
     *       404:
     *         description: Favor not found
     */
    router.put('/favor/:id', async (req: Request, res: Response) => {
        const { id } = req.params;
        const { reimbursed, amount } = req.body;

        try {
            // Validate input
            if (amount === undefined || reimbursed === undefined) {
                return res.status(400).json({ error: 'reimbursed and amount are required' });
            }

            // Check if favor exists
            const existing = await db.oneOrNone(
                'SELECT id FROM Favor WHERE id = $1',
                [id]
            );

            if (!existing) {
                return res.status(404).json({ error: 'Favor not found' });
            }

            // Update favor
            const reimbursedAt = reimbursed ? new Date() : null;
            await db.none(
                'UPDATE Favor SET amount = $1, reimbursed = $2 WHERE id = $3',
                [amount, reimbursedAt, id]
            );

            res.status(200).json({
                message: 'Favor updated successfully',
                id: parseInt(id),
                reimbursed,
                amount,
                reimbursedAt: reimbursedAt ? reimbursedAt.toISOString() : null
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @openapi
     * /shop:
     *   get:
     *     summary: Get shopping list
     *     description: Get a shopping list for the user's shopping trip that covers the needs of one or more users.
     *     responses:
     *       200:
     *         description: Shopping list retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   itemIds:
     *                     type: array
     *                     items:
     *                       type: integer
     *                     description: The items in personal lists, covered by this item in the shopping list
     *                     example: [1, 15, 23]
     *                   item:
     *                     type: string
     *                     description: The name of the item
     *                     example: Milk
     *                   neededBy:
     *                     type: array
     *                     items:
     *                       type: string
     *                     description: The users who need the item
     *                     example: ["user1", "user2", "user3"]
     */
    router.get('/shop', async (req: Request, res: Response) => {
        try {
            // Get all unfulfilled items grouped by item name
            const items = await db.any(`
                SELECT 
                    li.itemName as item,
                    array_agg(li.id) as itemIds,
                    array_agg(u.username) as neededBy
                FROM ListItem li
                JOIN AppUser u ON li.userID = u.id
                LEFT JOIN Favor f ON li.id = f.itemID
                WHERE f.id IS NULL
                GROUP BY li.itemName
                ORDER BY li.itemName
            `);

            const formattedItems = items.map(item => ({
                itemIds: item.itemids,
                item: item.item,
                neededBy: item.neededby
            }));

            res.status(200).json(formattedItems);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};

export default router;
