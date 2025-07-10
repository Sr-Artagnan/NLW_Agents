import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod"
import { db } from "../../db/connection.ts"
import { schema } from "../../db/schema/index.ts" 
import { z } from "zod/v4"
import { eq } from "drizzle-orm"

export const getRoomQuestionsRoute: FastifyPluginCallbackZod  = (app) => {
  app.get('/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      const result = await db.select(
        {
          id: schema.questions.id,
          question: schema.questions.question,
          answers: schema.questions.answer,
          createdAt: schema.questions.createdAt,
        }
      ).from(schema.questions).where(eq(schema.questions.roomId, roomId))
      .orderBy(schema.questions.createdAt)

      return result
    }
  )
}