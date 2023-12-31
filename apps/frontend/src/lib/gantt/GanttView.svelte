<script lang="ts">
	import { SvelteGantt, SvelteGanttDependencies, SvelteGanttTable } from 'svelte-gantt'
	import type { SvelteGanttComponent, SvelteGanttOptions } from 'svelte-gantt/types/gantt'
	import { addDays, endOfWeek, startOfWeek, subDays } from 'date-fns'
	import { currentRecordId, getTable, listRecordFn, readonly, recordHash } from '$lib/store/table'
	import { RecordFactory, type DateRangeField } from '@undb/core'
	import type { RowModel } from 'svelte-gantt/types/core/row'
	import type { TaskModel } from 'svelte-gantt/types/core/task'
	import { onMount } from 'svelte'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'

	const table = getTable()
	export let field: DateRangeField

	let currentStart = startOfWeek(new Date())
	let currentEnd = endOfWeek(new Date())

	const previous = () => {
		currentStart = subDays(currentStart, 7)
		currentEnd = subDays(currentEnd, 7)
	}

	const next = () => {
		currentStart = addDays(currentStart, 7)
		currentEnd = addDays(currentEnd, 7)
	}

	$: listRecords = $listRecordFn(
		[
			{
				path: field.id.value,
				type: field.type,
				operator: '$between',
				value: [currentStart.toISOString(), currentEnd.toISOString()],
			},
		],
		{
			queryHash: $recordHash + '_gantt',
		},
	)

	const updateRecord = trpc().record.update.mutation({
		async onSuccess(data, variables, context) {
			await $listRecords.refetch()
		},
	})

	$: records = RecordFactory.fromQueryRecords($listRecords?.data?.records ?? [], $table.schema.toIdMap()) ?? []
	$: rows = records.map<RowModel>((r) => ({
		id: r.id.value,
		label: r.getDisplayFieldsValue($table),
		height: 52,
		classes: 'bg-gray-100 dark:!bg-gray-300 dark:text-white',
	}))
	$: tasks = records.map<TaskModel>((r) => {
		const value = r.valuesJSON?.[field.id.value]
		const [from, to] = value
		const fromTimeStamp = new Date(from).getTime()
		const toTimeStampe = new Date(to).getTime()

		return {
			id: r.id.value as any as number,
			resourceId: r.id.value as any as number,
			label: r.getDisplayFieldsValue($table),
			from: fromTimeStamp,
			to: toTimeStampe,
			classes: '!bg-blue-400 hover:!bg-blue-500',
			enableDragging: !$readonly,
		}
	})

	$: options = {
		rows,
		tasks,
		dependencies: [],
		timeRanges: [],
		columnOffset: 15,
		magnetOffset: 15,
		rowHeight: 52,
		rowPadding: 6,
		headers: [{ unit: 'day', format: 'MMMM Do' }],
		fitWidth: true,
		minWidth: 800,
		from: currentStart.getTime(),
		to: currentEnd.getTime(),
		tableHeaders: [{ title: $t('Label', { ns: 'common' }), property: 'label', width: 140 }],
		tableWidth: 240,
		ganttTableModules: [SvelteGanttTable],
		ganttBodyModules: [SvelteGanttDependencies],
	} satisfies SvelteGanttOptions

	let ele: HTMLElement | undefined
	let gantt: SvelteGanttComponent
	onMount(() => {
		if (ele) {
			gantt = new SvelteGantt({ target: ele, props: options })
			// @ts-expect-error
			gantt.api.tasks.on.dblclicked((event, b) => {
				const [model] = event
				if (!model) return
				const recordId = model.id
				$currentRecordId = recordId
			})
			// @ts-expect-error
			gantt.api.tasks.on.changed((event) => {
				const [model] = event
				if (!model) return
				if (model.sourceRow.model.id !== model.targetRow.model.id) return

				const task = model.task
				const recordId = task.model.resourceId
				const newFrom = new Date(task.model.from)
				const newTo = new Date(task.model.to)

				$updateRecord.mutate({
					tableId: $table.id.value,
					id: recordId,
					values: {
						[field.id.value]: [newFrom.toISOString(), newTo.toISOString()],
					},
				})
			})
		}
	})

	$: if (gantt) gantt.$set(options)
</script>

<div class="w-full">
	<div class="p-2 text-gray-500">
		<div class="flex justify-end gap-2">
			<button
				on:click={previous}
				class="p-1 hover:bg-gray-100 w-6 h-6 inline-flex items-center justify-center transition"
			>
				<i class="ti ti-chevron-left" />
			</button>
			<button on:click={next} class="p-1 hover:bg-gray-100 w-6 h-6 inline-flex items-center justify-center transition">
				<i class="ti ti-chevron-right" />
			</button>
		</div>
	</div>
	<div class="border-t" bind:this={ele} id="undb-gantt" />
</div>

<style>
	#undb-gantt {
		flex-grow: 1;
		overflow: auto;
	}

	#undb-gantt :global(.sg-hover) {
		background-color: #00000008;
	}

	#undb-gantt :global(.sg-hover .sg-table-body-cell) {
		background-color: #00000008;
	}

	:global(.dark .sg-gantt .column-header-cell) {
		color: white;
	}

	:global(.dark .sg-gantt .column-header-cell:hover) {
		color: #374151;
		background-color: #f7f7f7;
	}

	:global(.dark .sg-gantt .sg-table-body-cell) {
		color: white;
		background-color: #374151;
		border: none;
	}

	:global(.dark .sg-gantt .sg-table-header-cell) {
		color: white;
		background-color: #374151;
	}
</style>
