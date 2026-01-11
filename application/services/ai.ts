'use server'

import { OpenAI } from 'openai'
import { getChatHistory, saveChatMessage } from './sessions'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const DEFAULT_MODEL = 'gpt-4o'
const SYSTEM_PROMPT = 'You are a helpful AI assistant for WorkBase, a productivity workspace application. You help users with task management, productivity tips, time management, and work-related questions. Be professional, concise, and helpful. Focus on actionable advice and practical solutions.'

export async function chatWithAI(message: string, sessionId: string) {
    try {
        // 1. Get history from Supabase
        const history = await getChatHistory(sessionId)

        // 2. Map history to OpenAI format
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history.map(m => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            }))
        ]

        // Add the new user message
        messages.push({ role: 'user', content: message })

        // 3. Save user message to Supabase
        await saveChatMessage(sessionId, { role: 'user', content: message })

        // 4. Call OpenAI
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
            messages: messages as any,
            temperature: 0.7,
            max_tokens: 500,
        })

        const assistantMessage = completion.choices[0].message.content || 'I am sorry, I could not generate a response.'

        // 5. Save assistant response to Supabase
        await saveChatMessage(sessionId, { role: 'assistant', content: assistantMessage })

        return {
            success: true,
            data: {
                message: assistantMessage
            }
        }
    } catch (error: any) {
        console.error('AI Chat Error:', error)
        return {
            success: false,
            error: error.message || 'Failed to generate AI response'
        }
    }
}

export async function clearAIConversation(sessionId: string) {
    // This logic is already in sessions.ts as clearChatHistory
    // But we might want to do more if needed.
    // For now we'll just expose it or let the component call clearChatHistory directly.
}

export async function generateAITaskSuggestions(taskDescription: string) {
    try {
        const prompt = `Based on this task: "${taskDescription}", suggest 3-5 actionable subtasks to accomplish it. Format as a numbered list.`;

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are a productivity expert helping users break down tasks into manageable steps.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.6,
            max_tokens: 300,
        });

        return {
            success: true,
            data: completion.choices[0].message.content
        }
    } catch (error: any) {
        console.error('Task suggestion error:', error);
        return {
            success: false,
            error: error.message
        }
    }
}

export async function analyzeProductivityWithAI(taskData: any) {
    try {
        const prompt = `Analyze this productivity data and provide 2-3 actionable insights: ${JSON.stringify(taskData)}`;

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are a productivity analyst providing concise, actionable insights.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.5,
            max_tokens: 250,
        });

        return {
            success: true,
            data: completion.choices[0].message.content
        }
    } catch (error: any) {
        console.error('Productivity analysis error:', error);
        return {
            success: false,
            error: error.message
        }
    }
}
