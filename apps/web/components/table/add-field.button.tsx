import { ActionIcon, IconColumnInsertRight } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { createFielModelOpened } from '../create-field-form/create-field-modal-opened.atom'

export const AddFieldButton: React.FC = () => {
  const setOpened = useSetAtom(createFielModelOpened)
  return (
    <ActionIcon onClick={() => setOpened(true)}>
      <IconColumnInsertRight />
    </ActionIcon>
  )
}
