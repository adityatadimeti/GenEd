import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const card = req.body.card || '';
  if (card.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(card),
      temperature: 0.6,
      max_tokens: 3000,
    });
    console.log('output: ' + completion.data.choices[0].text)
    res.status(200).json({ result: completion.data.choices[0].text, text_completion: completion.data });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(input) {
  
  return `Generate 10 educational flashcards with questions and answers based on content solely from the input text. Do not include information not explicitly included in the input. The intended audience is high school students.
   The flashcards should cover the key concepts and information in the input text in a concise and easy-to-understand manner. Here are two example flashcards:

  Front: What is the function of the mitochondria?
  Back: The mitochondria are responsible for producing energy in the cell through cellular respiration.
  
  Front: What are the three types of muscle tissue?
  Back: The three types of muscle tissue are skeletal, smooth, and cardiac. Skeletal muscle is responsible for voluntary movement, smooth muscle is found in organs and blood vessels, and cardiac muscle is found only in the heart.
  
  The input text is: ${input}.`;
}


