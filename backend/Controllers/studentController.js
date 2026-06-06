import { Groq } from "groq-sdk";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an AI Tutor named TutorGen for computer science students. You MUST NOT provide direct answers or write code for students under any circumstances. You must ONLY provide hints, conceptual explanations, and guide the student to solve the problem themselves.' },
        { role: 'user', content: message }
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ reply: chatCompletion.choices[0]?.message?.content || "I couldn't process that request." });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ message: "Failed to communicate with AI Tutor." });
  }
};
