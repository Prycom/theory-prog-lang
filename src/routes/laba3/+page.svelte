<script lang="ts">
	import { writable } from 'svelte/store';

	type DPDA = {
		states: string[];
		alphabet: string[];
		stackAlphabet: string[];
		transitions: Record<string, Record<string, [string, string][]>>;
		startState: string;
		startStackSymbol: string;
		acceptStates: string[];
	};

	const dpda = writable<DPDA | null>(null);
	const dpdaString = writable<string>('');
	const inputString = writable<string>('');
	const result = writable<string>('');
	const trace = writable<string[]>([]);

	/** Проверка цепочки для ДМПА */
	function checkChain(automaton: DPDA, chain: string): void {
		let currentState = automaton.startState;
		let stack = [automaton.startStackSymbol];
		const log: string[] = [
			`Начальное состояние: ${currentState}, стек: [${stack.join(', ')}]`
		];

		for (const char of chain) {
			if (!automaton.alphabet.includes(char)) {
				result.set(`Ошибка: символ '${char}' не принадлежит алфавиту автомата.`);
				trace.set(log);
				return;
			}

			const stackTop = stack[stack.length - 1] || '';
			const key = `(${currentState}, ${char}, ${stackTop})`;
			const transitions = automaton.transitions[currentState]?.[char];

			if (!transitions) {
				result.set(`Ошибка: из состояния '${currentState}' нет перехода по символу '${char}' и вершине стека '${stackTop}'.`);
				trace.set(log);
				return;
			}

			const [nextState, stackAction] = transitions[0]; // Выбираем первый переход (детерминированный автомат)
			log.push(`Состояние: ${currentState}, символ: '${char}', стек: [${stack.join(', ')}] -> новое состояние: ${nextState}, действие со стеком: '${stackAction}'`);

			currentState = nextState;

			if (stackAction === '') {
				stack.pop();
			} else {
				stack.pop();
				stack.push(...stackAction.split('').reverse());
			}
		}

		while (stack.length > 0 && !automaton.acceptStates.includes(currentState)) {
			const stackTop = stack[stack.length - 1];
			const key = `(${currentState}, λ, ${stackTop})`;
			const transitions = automaton.transitions[currentState]?.['λ'];

			if (!transitions) {
				result.set(`Ошибка: автомат застрял в состоянии '${currentState}' с непустым стеком [${stack.join(', ')}].`);
				trace.set(log);
				return;
			}

			const [nextState, stackAction] = transitions[0];
			log.push(`Лямбда-переход: состояние '${currentState}', стек: [${stack.join(', ')}] -> новое состояние: ${nextState}, действие со стеком: '${stackAction}'`);

			currentState = nextState;

			if (stackAction === '') {
				stack.pop();
			} else {
				stack.pop();
				stack.push(...stackAction.split('').reverse());
			}
		}

		if (automaton.acceptStates.includes(currentState)) {
			result.set(`Цепочка '${chain}' принадлежит языку.`);
		} else {
			result.set(`Ошибка: автомат остановился в состоянии '${currentState}', которое не является принимающим.`);
		}

		trace.set(log);
	}

	/** Загрузка автомата из файла */
	async function handleFileUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		try {
			const content = await file.text();
			const automaton: DPDA = JSON.parse(content);
			dpda.set(automaton);
			dpdaString.set(JSON.stringify(automaton, null, 2));
			result.set('');
			trace.set([]);
		} catch (error) {
			alert('Ошибка загрузки автомата: неверный формат файла.');
		}
	}

	/** Обработчик проверки цепочки */
	function handleCheck() {
		dpda.subscribe((automaton) => {
			if (automaton) {
				inputString.subscribe((chain) => {
					checkChain(automaton, chain);
				});
			} else {
				alert('Сначала загрузите автомат.');
			}
		});
	}
</script>

<h1 class="text-xl font-bold">Проверка цепочки для ДМПА</h1>

<section class="m-2">
	<h2 class="">Загрузка ДМПА</h2>
	<input type="file" accept=".json" on:change={handleFileUpload} />
	<p class="m-4">
		{#if $dpdaString}
			Загруженный ДМПА:
			<pre class="dpda-code"><code>{$dpdaString}</code></pre>
		{:else}
			<p><em>Загрузите файл с автоматом, чтобы увидеть его содержимое.</em></p>
			Формат файла должен быть JSON:
			<pre>
<code>
{
	`
  "states": ["q0", "q1", "qf"],
  "alphabet": ["0", "1"],
  "stackAlphabet": ["Z", "0"],
  "transitions": {
    "(q0, 0, Z)": [["q0", "0Z"]],
    "(q0, 1, 0)": [["q1", ""]],
    "(q1, λ, Z)": [["qf", ""]]
  },
  "startState": "q0",
  "startStackSymbol": "Z",
  "acceptStates": ["qf"]
`
}
</code>
</pre>
		{/if}
	</p>
</section>

<section class="m-2">
	<h2>Ввод цепочки</h2>
	<input type="text" placeholder="Введите цепочку" bind:value={$inputString} />
	<button on:click={handleCheck}>Проверить</button>
</section>

<section class="mb-12">
	<h2>Результаты</h2>
	<p><strong>Результат:</strong> {$result}</p>
	<div class="log mb-12">
		<h3>Лог проверки:</h3>
		<ul>
			{#each $trace as step}
				<li>{step}</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.log {
		margin-top: 1em;
		background: #f9f9f9;
		padding: 1em;
		border-radius: 5px;
		font-family: monospace;
	}
	.dpda-code {
		margin-top: 1em;
		background: #f4f4f4;
		padding: 1em;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-family: monospace;
		overflow-x: auto;
	}
</style>
