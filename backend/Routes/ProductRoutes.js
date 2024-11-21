const ensureAuthenticated = require('../Middlewares/Auth');
const router = require('express').Router();
const listController = require('../Controllers/ListController');

// Test Route (Logged-in User Details)
router.get('/', ensureAuthenticated, (req, res) => {
    console.log('---- logged in user detail ---', req.user);
    res.status(200).json([
        {
            name: "mobile",
            price: 10000
        },
        {
            name: "tv",
            price: 20000
        }
    ]);
});

// Route: Fetch HTTP Status Codes and Images
router.get('/search', ensureAuthenticated, (req, res) => {
    const { filter } = req.query; // Filter passed as query param
    if (!filter) {
        return res.status(400).json({ success: false, message: 'Filter is required' });
    }

    const results = [];
    if (/^\d{3}$/.test(filter)) {
        // Exact code (e.g., 203)
        results.push({ code: filter, image: `https://http.dog/${filter}.jpg` });
    } else if (/^\dxx$/.test(filter)) {
        // Codes like 2xx
        const start = parseInt(filter[0]) * 100;
        for (let i = start; i < start + 100; i++) {
            results.push({ code: i, image: `https://http.dog/${i}.jpg` });
        }
    } else if (/^\d{2}x$/.test(filter)) {
        // Codes like 20x
        const start = parseInt(filter.slice(0, 2)) * 10;
        for (let i = start; i < start + 10; i++) {
            results.push({ code: i, image: `https://http.dog/${i}.jpg` });
        }
    } else {
        return res.status(400).json({ success: false, message: 'Invalid filter format' });
    }

    res.status(200).json({ success: true, data: results });
});

router.post('/save', ensureAuthenticated, listController.saveList);

// Get all lists for the logged-in user
router.get('/all', ensureAuthenticated, listController.getAllLists);

// Delete a list by ID
router.delete('/:id', ensureAuthenticated, listController.deleteList);

// Update a list by ID
router.put('/:id', ensureAuthenticated, listController.updateList);

// Route: Fetch All Saved Lists
router.get('/lists', ensureAuthenticated, (req, res) => {
    // Dummy data for now; can be connected to a database
    const lists = [
        {
            name: 'Success Codes',
            creationDate: '2024-11-20',
            codes: ['200', '201', '204'],
        },
        {
            name: 'Redirect Codes',
            creationDate: '2024-11-20',
            codes: ['300', '301', '302'],
        },
    ];

    res.status(200).json({ success: true, data: lists });
});

// // Route: Save a List
// router.post('/lists', ensureAuthenticated, (req, res) => {
//     const { name, codes } = req.body;

//     if (!name || !codes || !Array.isArray(codes)) {
//         return res.status(400).json({ success: false, message: 'Name and codes are required' });
//     }

//     // Normally, save the list to the database. Returning a success response for now.
//     res.status(201).json({
//         success: true,
//         message: 'List saved successfully',
//         data: { name, codes, creationDate: new Date().toISOString() },
//     });
// });

// // Route: Delete a List
// router.delete('/lists/:name', ensureAuthenticated, (req, res) => {
//     const { name } = req.params;

//     // Normally, delete the list from the database. Returning a success response for now.
//     res.status(200).json({
//         success: true,
//         message: `List '${name}' deleted successfully`,
//     });
// });

module.exports = router;
