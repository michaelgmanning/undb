<script lang="ts">
	import cx from 'classnames'
	import type { IFieldType, ReferenceField } from '@undb/core'
	import { DropdownItem } from 'flowbite-svelte'
	import { getForeignTable } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import FieldIcon from '../FieldIcon.svelte'
	import { createFieldInitial, createFieldModal } from '$lib/store/modal'

	export let field: ReferenceField

	$: foreignTableId = field.foreignTableId.into()
	$: foreignTable = $getForeignTable(foreignTableId)
</script>

{#if foreignTable}
	<DropdownItem
		{...$$restProps}
		href={`/t/${foreignTableId}`}
		class={cx('flex items-center w-full', $$restProps.class)}
	>
		<i class="ti ti-external-link" />
		<span>
			{$t('jump to table', { name: foreignTable.name.value })}
		</span>
	</DropdownItem>

	<DropdownItem
		{...$$restProps}
		on:click={() => {
			$createFieldInitial = {
				type: 'lookup',
				referenceFieldId: field.id.value,
			}
			createFieldModal.open()
		}}
	>
		<FieldIcon type={field.type} />
		<span>
			{$t('Insert Lookup Field')}
		</span>
	</DropdownItem>

	<DropdownItem
		{...$$restProps}
		on:click={() => {
			$createFieldInitial = {
				type: 'count',
				referenceFieldId: field.id.value,
			}
			createFieldModal.open()
		}}
	>
		<FieldIcon type={field.type} />
		<span>
			{$t('Insert Count Field')}
		</span>
	</DropdownItem>

	<DropdownItem
		{...$$restProps}
		on:click={() => {
			$createFieldInitial = {
				type: 'sum',
				referenceFieldId: field.id.value,
			}
			createFieldModal.open()
		}}
	>
		<FieldIcon type={field.type} />
		<span>
			{$t('Insert Sum Field')}
		</span>
	</DropdownItem>

	<DropdownItem
		{...$$restProps}
		on:click={() => {
			$createFieldInitial = {
				type: 'average',
				referenceFieldId: field.id.value,
			}
			createFieldModal.open()
		}}
	>
		<FieldIcon type={field.type} />
		<span>
			{$t('Insert Average Field')}
		</span>
	</DropdownItem>
{/if}
