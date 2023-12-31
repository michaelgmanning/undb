import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { PinoLogger } from 'nestjs-pino'
import { cacheStorageConfig } from '../../../configs/cache-storage.config.js'
import { CSVExportor, RECORD_CSV_EXPORTOR } from '../exportor/csv.exportor.js'
import { ExcelExportor, RECORD_EXCEL_EXPORTOR } from '../exportor/excel.exportor.js'
import { NestRecordExportorService } from '../exportor/exportor.service.js'
import { JsonExportor, RECORD_JSON_EXPORTOR } from '../exportor/json.exportor.js'
import { cacheStorageFactory } from './cache-storage.factory.js'
import { NestAggregateSqliteQueryModel } from './sqlite/record-sqlite.aggregate-repository.js'
import { NestRecordSqliteQueryModel } from './sqlite/record-sqlite.query-model.js'
import { NestRecordSqliteRepository } from './sqlite/record-sqlite.repository.js'
import { NestRecordSqliteTreeQueryModel, RECORD_TREE_QUERY_MODEL } from './sqlite/record-sqlite.tree-query-model.js'
import { NestTableKVCache, STORAGE } from './sqlite/table-kv.cache.js'
import { NestTableSqliteQueryModel } from './sqlite/table-sqlite.query-model.js'
import { NestTableSqliteRepository, TABLE_KV_CACHE } from './sqlite/table-sqlite.repository.js'

export const TABLE_REPOSITORY = Symbol('TABLE_REPOSITORY')
export const InjectTableRepository = () => Inject(TABLE_REPOSITORY)

const TABLE_QUERY_MODEL = Symbol('TABLE_QUERY_MODEL')
export const InjectTableQueryModel = () => Inject(TABLE_QUERY_MODEL)

const RECORD_AGGREGATE_REPOSITORY = Symbol('RECORD_AGGREGATE_REPOSITORY')
export const InjectRecordAggregateRepositoy = () => Inject(RECORD_AGGREGATE_REPOSITORY)

const RECORD_REPOSITORY = Symbol('RECORD_REPOSITORY')
export const InjectRecordRepository = () => Inject(RECORD_REPOSITORY)

const RECORD_QUERY_MODEL = Symbol('RECORD_QUERY_MODEL')
export const InjectRecordQueryModel = () => Inject(RECORD_QUERY_MODEL)

export const dbAdapters: Provider[] = [
  {
    provide: TABLE_REPOSITORY,
    useClass: NestTableSqliteRepository,
  },
  {
    provide: TABLE_QUERY_MODEL,
    useClass: NestTableSqliteQueryModel,
  },
  {
    provide: RECORD_REPOSITORY,
    useClass: NestRecordSqliteRepository,
  },
  {
    provide: RECORD_QUERY_MODEL,
    useClass: NestRecordSqliteQueryModel,
  },
  {
    provide: RECORD_TREE_QUERY_MODEL,
    useClass: NestRecordSqliteTreeQueryModel,
  },
  {
    provide: RECORD_AGGREGATE_REPOSITORY,
    useClass: NestAggregateSqliteQueryModel,
  },
  {
    provide: RECORD_CSV_EXPORTOR,
    useClass: CSVExportor,
  },
  {
    provide: RECORD_EXCEL_EXPORTOR,
    useClass: ExcelExportor,
  },
  {
    provide: RECORD_JSON_EXPORTOR,
    useClass: JsonExportor,
  },
  {
    provide: TABLE_KV_CACHE,
    useClass: NestTableKVCache,
  },
  {
    provide: STORAGE,
    useFactory: cacheStorageFactory,
    inject: [PinoLogger, cacheStorageConfig.KEY],
  },
  NestRecordExportorService,
]
