import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { type IRecordQueryModel, type ITableQueryModel } from '@undb/core'
import type { IGetShareViewRecordsOutput } from '@undb/cqrs'
import { GetShareViewRecordsQuery, GetShareViewRecordsQueryHandler } from '@undb/cqrs'
import { InjectRecordQueryModel, InjectTableQueryModel } from '../../core/table/adapters/index.js'
import { NestShareGuardService } from '../services/share-guard.service.js'

@QueryHandler(GetShareViewRecordsQuery)
export class NestGetShareViewRecordsQueryHandler
  extends GetShareViewRecordsQueryHandler
  implements IQueryHandler<GetShareViewRecordsQuery, IGetShareViewRecordsOutput>
{
  constructor(
    guard: NestShareGuardService,
    @InjectTableQueryModel()
    protected readonly tableRepo: ITableQueryModel,
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
  ) {
    super(guard, tableRepo, rm)
  }
}
