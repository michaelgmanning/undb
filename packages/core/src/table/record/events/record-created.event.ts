import { BaseEvent } from '@undb/domain'
import { z } from 'zod'
import type { Table } from '../../table.js'
import { recordReadableMapper, recordReadableSchema } from '../record.readable.js'
import type { IQueryRecordSchema } from '../record.type.js'
import { baseEventSchema, baseRecordEventSchema, type BaseRecordEventName } from './base-record.event.js'

export const EVT_RECORD_CREATED = 'record.created' as const

export const recordCreatedEventPayload = z
  .object({
    record: recordReadableSchema,
  })
  .merge(baseRecordEventSchema)

type IRecordCreatedEventPayload = z.infer<typeof recordCreatedEventPayload>

export const recordCreatedEvent = z
  .object({ name: z.literal(EVT_RECORD_CREATED), payload: recordCreatedEventPayload })
  .merge(baseEventSchema)

export class RecordCreatedEvent extends BaseEvent<IRecordCreatedEventPayload, BaseRecordEventName> {
  public readonly name = EVT_RECORD_CREATED

  static from(table: Table, operatorId: string, record: IQueryRecordSchema): RecordCreatedEvent {
    const recordValues = recordReadableMapper(table.schema.fields, record)
    return new this({ tableId: table.id.value, tableName: table.name.value, record: recordValues }, operatorId)
  }
}
