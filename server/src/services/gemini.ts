import { GoogleGenAI } from "@google/genai";
import { env } from "../env.ts";

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
})

const model = 'gemini-2.5-flash'

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: 'Transcreva o audio para o português do Brasil. Seja preciso e natural na transcrição, mantenha a pontuação e a gramática.'
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64,
        },
      },
    ],
  })

  if(!response.text) {
    throw new Error('Failed to transcribe audio')
  }
  return response.text
}

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: [{text}],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT',
    }
  })

  if(!response.embeddings) {
    throw new Error('Failed to generate embeddings')
  }
  return response.embeddings[0].values
}


export async function generateAnsware(questions:string, transcripts: string[]) {
  const context = transcripts.join('\n\n')
  const prompt = `Com base no texto fornecido abaixo como contexto, responda a pergunta de forma clara e precisa, em português do Brasil.
  Contexto: ${context}
  Pergunta: ${questions}
  Instruções:
  - Se o contexto não for relevante para a pergunta, responda com "Não sei"
  - Se o contexto for relevante, responda de forma clara e precisa, em português do Brasil.
  - Se o contexto for insuficiente, responda com "Não sei"
  - Se o contexto for suficiente, responda de forma clara e precisa, em português do Brasil.
  - Se o contexto for suficiente, responda de forma clara e precisa, em português do Brasil.
  `.trim()

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt
      }
    ]
  }) 
  if(!response.text) {
    throw new Error('Failed to generate answare')
  }
  return response.text
}

