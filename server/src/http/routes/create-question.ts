import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod"
import { db } from "../../db/connection.ts"
import { schema } from "../../db/schema/index.ts" 
import { z } from "zod/v4"
import { generateAnsware, generateEmbeddings } from "../../services/gemini.ts"
import { and, eq, sql } from "drizzle-orm"

export const createQuestionRoute: FastifyPluginCallbackZod  = (app) => {
  app.post('/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      const { question } = request.body

      const embeddings = await generateEmbeddings(question)

      const embeddingsAsString = `[${embeddings?.join(",")}]`

      const chunks = await db.select({
        id: schema.audioChunks.id,
        transcript: schema.audioChunks.transcript,
        similarity: sql<number>` 1 - (${schema.audioChunks.embedding} <=> ${embeddingsAsString}::vector)`,
      })
      .from(schema.audioChunks)
      .where(
        and(
          eq(schema.audioChunks.roomId, roomId),
          sql<number>`1 - (${schema.audioChunks.embedding} <=> ${embeddingsAsString}::vector) > 0.7` ,
        )
      )
      .orderBy(
        sql`1 - (${schema.audioChunks.embedding} <=> ${embeddingsAsString}::vector)`
      )
      .limit(3)

      let answer: string | null = null

      if(chunks.length > 0) {
        const transcripts = chunks.map((chunk) => chunk.transcript)
        answer = await generateAnsware(question, transcripts)
      }
    
      const result = await db.insert(schema.questions).values({
        roomId,
        question,
        answer,
      }).returning()

      const insertedQuestion = result[0]

      if (!insertedQuestion) {
        throw new Error("Failed to create question")
      }

      return reply.status(201).send({ 
        questionId: insertedQuestion.id,
        answer,
      })
    
    }
     
  )
}