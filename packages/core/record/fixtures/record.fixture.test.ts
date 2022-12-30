import { NumberEqual, StringEqual } from '../specifications'
import { RecordCompositeSpecification } from '../specifications/interface'
import { createTestRecord } from './record.fixture'

beforeAll(() => {
  vi.setSystemTime(new Date(2022, 1, 1))
})

test.each<RecordCompositeSpecification[][]>([
  [[new StringEqual('hello', 'world')]],
  [[new NumberEqual('hello', 1)]],
  [[new StringEqual('hello', 'world'), new NumberEqual('number', 1)]],
])('createTestRecord', (specs) => {
  const record = createTestRecord(...specs)
  expect(record).toMatchSnapshot()
})