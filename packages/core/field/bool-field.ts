import type { IBoolFilter } from '../filter/bool.filter'
import type { IBoolFilterOperator } from '../filter/operators'
import { BoolFieldValue } from './bool-field-value'
import type { BoolFieldType, ICreateBoolFieldInput, ICreateBoolFieldValue } from './bool-field.type'
import { BaseField } from './field.base'
import type { IBoolField } from './field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class BoolField extends BaseField<IBoolField> {
  get type(): BoolFieldType {
    return 'bool'
  }

  static create(input: ICreateBoolFieldInput): BoolField {
    return new BoolField({
      id: FieldId.from(input.id),
      name: FieldName.create(input.name),
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateBoolFieldInput): BoolField {
    return new BoolField({
      id: FieldId.from(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }

  createValue(value: ICreateBoolFieldValue): BoolFieldValue {
    return new BoolFieldValue(value)
  }

  createFilter(operator: IBoolFilterOperator, value: boolean | null): IBoolFilter {
    return { operator, value, path: this.name.value, type: 'bool' }
  }
}