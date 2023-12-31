import { tableIdSchema, viewIdSchema } from '@undb/core'
import { shareIdSchema } from '@undb/integrations'
import * as z from 'zod'

export const getShareQueryInput = z.object({
  tableId: tableIdSchema,
  id: shareIdSchema.optional(),
  targetId: viewIdSchema.or(tableIdSchema).optional(),
})
