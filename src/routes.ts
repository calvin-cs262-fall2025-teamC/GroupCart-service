import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
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
router.post('/user/:username', (req: Request, res: Response) => {
  const { username } = req.params;
  const { firstName, lastName } = req.body;
  
  // Dummy response
  res.status(201).json({
    message: 'User created successfully',
    username,
    firstName,
    lastName
  });
});

/**
 * @swagger
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
router.get('/user/:username', (req: Request, res: Response) => {
  const { username } = req.params;
  
  // Dummy response
  res.status(200).json({
    firstName: 'John',
    lastName: 'Doe',
    groupId: 'group123'
  });
});

/**
 * @swagger
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
router.post('/group/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, users } = req.body;
  
  // Dummy response
  res.status(201).json({
    message: 'Group created successfully',
    id,
    name,
    users: users || []
  });
});

/**
 * @swagger
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
router.get('/group/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Dummy response
  res.status(200).json({
    name: 'Sample Group',
    users: ['user1', 'user2', 'user3'],
    userColors: {
      user1: '#FF5733',
      user2: '#33FF57',
      user3: '#3357FF'
    }
  });
});

/**
 * @swagger
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
router.get('/list/:username', (req: Request, res: Response) => {
  const { username } = req.params;
  
  // Dummy response
  res.status(200).json([
    {
      id: 1,
      item: 'Milk',
      priority: 1,
      added: '2025-10-25T10:00:00Z',
      fulfilled: false,
      fulfilledBy: null,
      fulfilledAt: null,
      favorId: null
    },
    {
      id: 2,
      item: 'Bread',
      priority: 2,
      added: '2025-10-25T11:00:00Z',
      fulfilled: true,
      fulfilledBy: 'user2',
      fulfilledAt: '2025-10-26T09:00:00Z',
      favorId: 5
    }
  ]);
});

/**
 * @swagger
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
router.post('/list/:username', (req: Request, res: Response) => {
  const { username } = req.params;
  const { item, priority } = req.body;
  
  // Dummy response
  res.status(201).json({
    message: 'Item added successfully',
    id: 123,
    item,
    priority,
    added: new Date().toISOString()
  });
});

/**
 * @swagger
 * /list/{username}/{id}:
 *   patch:
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
router.patch('/list/:username/:id', (req: Request, res: Response) => {
  const { username, id } = req.params;
  const { item, priority } = req.body;
  
  // Dummy response
  res.status(200).json({
    message: 'Item modified successfully',
    id: parseInt(id),
    item,
    priority
  });
});

/**
 * @swagger
 * /list/{username}/{id}:
 *   delete:
 *     summary: Delete grocery list item
 *     description: Delete the specified item from the user's personal grocery list. This should be called when an item is bought or a favor is fulfilled.
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
router.delete('/list/:username/:id', (req: Request, res: Response) => {
  const { username, id } = req.params;
  
  // Dummy response
  res.status(200).json({
    message: 'Item deleted successfully',
    id: parseInt(id)
  });
});

/**
 * @swagger
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
router.get('/favors/for/:username', (req: Request, res: Response) => {
  const { username } = req.params;
  
  // Dummy response
  res.status(200).json([
    {
      id: 5,
      itemId: 2,
      item: 'Bread',
      fulfilledAt: '2025-10-26T09:00:00Z',
      by: 'user2',
      reimbursed: false,
      reimbursedAt: null,
      amount: 3.50
    },
    {
      id: 8,
      itemId: 7,
      item: 'Eggs',
      fulfilledAt: '2025-10-25T14:00:00Z',
      by: 'user3',
      reimbursed: true,
      reimbursedAt: '2025-10-26T10:00:00Z',
      amount: 4.99
    }
  ]);
});

/**
 * @swagger
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
router.get('/favors/by/:username', (req: Request, res: Response) => {
  const { username } = req.params;
  
  // Dummy response
  res.status(200).json([
    {
      id: 6,
      itemId: 3,
      item: 'Cheese',
      fulfilledAt: '2025-10-26T08:00:00Z',
      for: 'user1',
      reimbursed: false,
      reimbursedAt: null,
      amount: 5.99
    },
    {
      id: 9,
      itemId: 10,
      item: 'Coffee',
      fulfilledAt: '2025-10-25T15:00:00Z',
      for: 'user4',
      reimbursed: true,
      reimbursedAt: '2025-10-26T11:00:00Z',
      amount: 12.99
    }
  ]);
});

/**
 * @swagger
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
router.post('/favor', (req: Request, res: Response) => {
  const { itemId, item, by, for: forUser, amount } = req.body;
  
  // Dummy response
  res.status(201).json({
    message: 'Favor marked as fulfilled',
    id: 15,
    itemId,
    item,
    by,
    for: forUser,
    amount,
    fulfilledAt: new Date().toISOString(),
    reimbursed: false
  });
});

/**
 * @swagger
 * /favor/{id}:
 *   patch:
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
router.patch('/favor/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { reimbursed, amount } = req.body;
  
  // Dummy response
  res.status(200).json({
    message: 'Favor updated successfully',
    id: parseInt(id),
    reimbursed,
    amount,
    reimbursedAt: reimbursed ? new Date().toISOString() : null
  });
});

/**
 * @swagger
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
router.get('/shop', (req: Request, res: Response) => {
  // Dummy response
  res.status(200).json([
    {
      itemIds: [1, 15, 23],
      item: 'Milk',
      neededBy: ['user1', 'user2', 'user3']
    },
    {
      itemIds: [5],
      item: 'Bread',
      neededBy: ['user1']
    },
    {
      itemIds: [8, 12],
      item: 'Eggs',
      neededBy: ['user2', 'user4']
    }
  ]);
});

export default router;
