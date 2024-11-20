const express = require('express');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10MB' }));

const port = process.env.PORT || 3050;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../dist/assets')));

app.use('/api/validate-word/:word', async (req, res) => {
  try{
    const wordToCheck = req.params.word.toLowerCase();
    const response = await isValidDictionaryWord(wordToCheck);
    const isValidWord = response.filter((result) => result?.hwi?.hw?.toLowerCase() === wordToCheck)?.some((result) => result.fl !== "abbreviation");
   
    return isValidWord ? res.status(200).send('valid') : res.status(500).send('invalid');
  }catch(error){
    console.log(error);
    return res.status(500).send("API Error");
  }
 
})

async function isValidDictionaryWord(word) {
  const apiUrl = `https://www.dictionaryapi.com/api/v3/references/learners/json/${word.toLowerCase()}?key=${process.env.APP_KEY}`

  try {
    const response = await fetch(apiUrl);

    if (response.ok) {
      return response.json();
    }
    else {
      const errorResponse = await response.json();
      console.log(errorResponse);
      return false; // Word does not exist in the dictionary   
    }
  } catch (error) {
    console.error('Error fetching dictionary data:', error);
    return false; // Network or API error
  }
}