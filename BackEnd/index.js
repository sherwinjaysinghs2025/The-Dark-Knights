const express = require('express');
const cors = require('cors');
const { default: fetch } = require('node-fetch'); // Corrected import for node-fetch
// Removed bcrypt and mongoose imports
// Removed User model import
const app = express();
const PORT = process.env.PORT || 5000;

// Removed MongoDB connection
// mongoose.connect('mongodb://localhost:27017/medaware_db', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected...'))
// .catch(err => console.error(err));

app.use(cors());
app.use(express.json());

// In-memory user storage - REMOVING THIS as we will use MongoDB
// const users = [];

// Register Route
// app.post('/register', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ message: 'User already exists.' });
//         }

//         user = new User({
//             email,
//             password, // Password will be hashed by pre-save hook
//         });

//         await user.save();
//         console.log('Registered user:', user.email);
//         res.status(201).json({ message: 'User registered successfully.' });
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ message: 'Server error during registration.' });
//     }
// });

// Login Route
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid credentials.' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (isMatch) {
//             res.json({ message: 'Logged in successfully.' });
//         } else {
//             res.status(400).json({ message: 'Invalid credentials.' });
//         }
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ message: 'Server error during login.' });
//     }
// });

app.get('/api/medicine/:name', async (req, res) => {
    const medicineName = req.params.name;
    const openFDAUrl = `https://api.fda.gov/drug/label.json?search=${medicineName}`;

    try {
        const response = await fetch(openFDAUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const structuredData = {
                medicineName: medicineName,
                ingredients: result.active_ingredient ? result.active_ingredient : ["N/A"],
                dosage: {
                    normal: result.dosage_and_administration ? result.dosage_and_administration[0] : "N/A",
                    severity_based: {
                        // OpenFDA API doesn't directly provide severity-based dosage in a structured way,
                        // so we'll just indicate that it's not available from this API.
                        "info": "Severity-based dosage not directly available from OpenFDA API. Refer to full dosage information."
                    }
                },
                side_effects: result.adverse_reactions ? result.adverse_reactions : ["N/A"],
                how_to_tackle_side_effects: {
                    "info": "Specific advice on tackling side effects not directly available from OpenFDA API. Consult a medical professional."
                }, // Placeholder for now, as OpenFDA doesn't provide this directly.
                who_should_avoid: result.warnings ? result.warnings : ["N/A"],
                indications: result.indications_and_usage ? result.indications_and_usage : ["N/A"]
            };
            res.json(structuredData);
        } else {
            res.status(404).json({ error: 'No information available for this medicine.' });
        }
    } catch (error) {
        console.error('Error fetching data from OpenFDA:', error);
        res.status(500).json({ error: 'Failed to fetch medicine information from OpenFDA.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
