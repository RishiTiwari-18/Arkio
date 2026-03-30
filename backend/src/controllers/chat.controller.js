import { generateContent } from "../services/ai.service.js"

export const sendMessage = async (req, res) => {
    const { message } = req.body

     const data = await generateContent(message)
    res.json({
        data
    })
}