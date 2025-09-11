const express = require('express');
const cors = require('cors');
const { default: fetch } = require('node-fetch'); // Corrected import for node-fetch

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// New route for Ollama Chatbot
app.post('/chat', async (req, res) => {
  const userQuery = req.body.query;

  if (!userQuery) {
    return res.status(400).json({ message: 'Chat query is required.' });
  }

  try {
    const ollamaApiUrl = 'http://localhost:11434/api/generate';
    const response = await fetch(ollamaApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2', // You can change the model as needed
        prompt: userQuery,
        stream: false, // We want the full response, not a stream
      }),
    });

    if (!response.ok) {
      console.error(`Error from Ollama API: ${response.status} - ${response.statusText}`);
      const errorBody = await response.text();
      return res.status(response.status).json({ message: `Error from Ollama API: ${errorBody}` });
    }

    const data = await response.json();
    console.log("Raw Ollama Chat Response:", data); // Log the raw response
    res.json({ response: data.response });

  } catch (error) {
    console.error('Server error during chatbot interaction:', error);
    res.status(500).json({ message: 'Server error during chatbot interaction.' });
  }
});

// New route for autocomplete suggestions
app.get('/api/medicines/search', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    // Broaden search to include generic name and substance name for better autocomplete suggestions
    const openFDAUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${query}*+OR+openfda.generic_name:${query}+OR+openfda.substance_name:${query}&limit=20`;
    console.log("OpenFDA Autocomplete URL:", openFDAUrl); // Debug log
    const response = await fetch(openFDAUrl);
    
    if (!response.ok) {
      console.error(`Error fetching suggestions from OpenFDA: ${response.statusText}`);
      return res.status(response.status).json({ message: 'Error fetching suggestions from OpenFDA.' });
    }

    const data = await response.json();
    const suggestions = [];

    if (data.results) {
      const uniqueNames = new Set();
      data.results.forEach(result => {
        if (result.openfda && result.openfda.brand_name) {
          result.openfda.brand_name.forEach(name => {
            if (name.toLowerCase().startsWith(query.toLowerCase())) {
              uniqueNames.add(name);
            }
          });
        }
      });
      suggestions.push(...Array.from(uniqueNames));
    }
    res.json(suggestions.slice(0, 10)); // Ensure only up to 10 unique suggestions are sent

  } catch (error) {
    console.error('Server error during autocomplete search:', error);
    res.status(500).json({ message: 'Server error during autocomplete search.' });
  }
});


// Route to fetch medicine data from OpenFDA and summarize with Ollama
app.get('/api/medicine/:name', async (req, res) => {
  const medicineName = req.params.name;

  if (!medicineName) {
    return res.status(400).json({ message: 'Medicine name is required.' });
  }

  try {
    // Step 1: Fetch data from OpenFDA
    const openFDAUrl = `https://api.fda.gov/drug/label.json?search=(openfda.brand_name:${medicineName})+OR+(products.brand_name:${medicineName})+OR+(products.proprietary_name:${medicineName})+OR+(openfda.generic_name:${medicineName})+OR+(openfda.substance_name:${medicineName})+OR+(drug_label:${medicineName})&limit=10`;
    console.log("OpenFDA Medicine Detail URL:", openFDAUrl); // Debug log
    const fdaResponse = await fetch(openFDAUrl);

    if (!fdaResponse.ok) {
      console.error(`Error fetching from OpenFDA: ${fdaResponse.status} - ${fdaResponse.statusText}`);
      const errorBody = await fdaResponse.text();
      return res.status(fdaResponse.status).json({ message: `Error fetching medicine data from OpenFDA: ${errorBody}` });
    }

    const fdaData = await fdaResponse.json();
    console.log("Raw OpenFDA Data for Medicine Detail:", fdaData); // Debug log

    if (!fdaData.results || fdaData.results.length === 0) {
      return res.status(404).json({ message: `Medicine "${medicineName}" not found in OpenFDA.` });
    }

    // Find the best matching result (prioritize exact match)
    let medicineDetails = fdaData.results.find(result => {
        const lowerCaseMedicineName = medicineName.toLowerCase();
        return (
            result.openfda?.brand_name?.some(name => name.toLowerCase() === lowerCaseMedicineName) ||
            result.products?.some(product => product.brand_name?.toLowerCase() === lowerCaseMedicineName) ||
            result.products?.some(product => product.proprietary_name?.toLowerCase() === lowerCaseMedicineName) ||
            result.openfda?.generic_name?.some(name => name.toLowerCase() === lowerCaseMedicineName) ||
            result.openfda?.substance_name?.some(name => name.toLowerCase() === lowerCaseMedicineName)
        );
    });

    if (!medicineDetails) {
      // If no exact match, try a broader search or fall back to the first result that includes the name
      medicineDetails = fdaData.results.find(result => 
        result.openfda?.brand_name?.some(name => name.toLowerCase().includes(medicineName.toLowerCase())) ||
        result.products?.some(product => product.brand_name?.toLowerCase().includes(medicineName.toLowerCase())) ||
        result.products?.some(product => product.proprietary_name?.toLowerCase().includes(medicineName.toLowerCase())) ||
        result.openfda?.generic_name?.some(name => name.toLowerCase().includes(medicineName.toLowerCase())) ||
        result.openfda?.substance_name?.some(name => name.toLowerCase().includes(medicineName.toLowerCase())) ||
        result.drug_label?.toLowerCase().includes(medicineName.toLowerCase())
      );
    }

    if (!medicineDetails) {
      medicineDetails = fdaData.results[0]; // Final fallback to the first result if no suitable match found
    }

    let summary = null;
    try {
        const ollamaApiUrl = 'http://localhost:11434/api/generate';
        const summaryPrompt = `Summarize the following medicine data in simple, user-friendly language. Focus on key information like active ingredients, dosage, side effects, warnings, and indications. Also, provide a brief, general description of the medicine. Only include information that is explicitly present in the data. If a section is empty, state that the information is not available. Ensure the response is concise and easy to understand for a general audience. Do not add any extra information or disclaimers not requested.:\n\n${JSON.stringify(medicineDetails, null, 2)}`;
        console.log("Ollama Summary Prompt:", summaryPrompt); // Debug log

        const ollamaResponse = await fetch(ollamaApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistral', // Use mistral model
                prompt: summaryPrompt,
                stream: false,
            }),
        });

        if (!ollamaResponse.ok) {
            console.error(`Error from Ollama API during summarization: ${ollamaResponse.status} - ${ollamaResponse.statusText}`);
            const errorBody = await ollamaResponse.text();
            summary = `Error generating summary: ${errorBody}`;
        } else {
            const ollamaData = await ollamaResponse.json();
            console.log("Raw Ollama Summary Response:", ollamaData); // Debug log
            summary = ollamaData.response;
        }
    } catch (ollamaError) {
        console.error('Server error during Ollama summarization:', ollamaError);
        summary = `Error generating summary: ${ollamaError.message}`;
    }

    res.json({
      medicineName: medicineDetails.openfda?.brand_name ? medicineDetails.openfda.brand_name[0] : medicineName,
      summary: summary,
      ingredients: medicineDetails.active_ingredient || [],
      dosage_and_administration: medicineDetails.dosage_and_administration || [],
      adverse_reactions: medicineDetails.adverse_reactions || [],
      warnings: medicineDetails.warnings || [],
      indications_and_usage: medicineDetails.indications_and_usage || [],
    });

  } catch (error) {
    console.error('Server error during medicine data fetch and summarization:', error);
    res.status(500).json({ message: 'Server error during medicine data fetch and summarization.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
