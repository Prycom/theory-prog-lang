<script lang="ts">
	import { writable } from 'svelte/store';

	type DFA = {
		states: string[]
		alphabet: string[];
		transitions: Record<string, Record<string, string>>;
		startState: string;
		acceptStates: string[];
	};

	const dfa = writable<DFA | null>(null);
	const dfaString = writable<string>('');
	const inputString = writable<string>('');
	const result = writable<string>(''); 
	const trace = writable<string[]>([]); 

	
	function checkChain(automaton: DFA, chain: string): void {
		let currentState = automaton.startState;
		const log: string[] = [`Начальное состояние: ${currentState}`];

		for (const char of chain) {
			if (!automaton.alphabet.includes(char)) {
				result.set(`Ошибка: символ '${char}' не принадлежит алфавиту автомата.`);
				trace.set(log);
				return;
			}

			const nextState = automaton.transitions[currentState]?.[char];
			if (!nextState) {
				result.set(
					`Ошибка: из состояния '${currentState}' не определён переход по символу '${char}'.`
				);
				trace.set(log);
				return;
			}

			log.push(`Состояние: ${currentState}, символ: '${char}' -> новое состояние: ${nextState}`);
			currentState = nextState;
		}

		if (automaton.acceptStates.includes(currentState)) {
			result.set(`Цепочка '${chain}' принадлежит языку.`);
		} else {
			result.set(
				`Ошибка: цепочка закончилась в состоянии '${currentState}', которое не является принимающим.`
			);
		}

		trace.set(log);
	}


	async function handleFileUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		try {
			const content = await file.text();
			const automaton: DFA = JSON.parse(content);
            console.log(automaton)
			dfa.set(automaton);
			dfaString.set(JSON.stringify(automaton, null, 2));
			result.set('');
			trace.set([]);
		} catch (error) {
            console.log(error)
			alert('Ошибка загрузки автомата: неверный формат файла.');
		}
	}

	function handleCheck() {
		dfa.subscribe((automaton) => {
			if (automaton) {
				inputString.subscribe((chain) => {
                    console.log(automaton, chain)
					checkChain(automaton, chain);
				});
			} else {
				alert('Сначала загрузите автомат.');
			}
		});
	}
</script>


<h2 class="text-xl font-semibold my-6" ><a href='/' class='no-underline hover:underline'>Лабораторная #2</a></h2>

<h1 class='text-xl font-bold'>Проверка цепочки для ДКА</h1>

<section class='m-2'>
	<h2 class=''>Загрузка ДКА</h2>
	<input type="file" accept=".json" on:change={handleFileUpload} />
	<p class='m-4'>
		{#if $dfaString}
		    Загруженный ДКА:
			<pre class="dfa-code"><code>{$dfaString}</code></pre>
		{:else}
			<p><em>Загрузите файл с автоматом, чтобы увидеть его содержимое.</em></p>
            Формат файла должен быть JSON:
    
        <pre>
        <code >
            {`{
                "states": ["q0", "q1", "q2"],
                "alphabet": ["0", "1"],
                "transitions": {
                    "q0": { "0": "q1", "1": "q0" },
                    "q1": { "0": "q2", "1": "q0" },
                    "q2": { "0": "q2", "1": "q0" }
                },
                "startState": "q0",
                "acceptStates": ["q2"]
            }`}
    </code>
</pre>
		{/if}
	</p>
</section>

<section class='m-2'>
	<h2>Ввод цепочки</h2>
	<input type="text" placeholder="Введите цепочку" bind:value={$inputString} />
	<button on:click={handleCheck}>Проверить</button>
</section>

<section class='mb-12'>
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
	.dfa-code {
		margin-top: 1em;
		background: #f4f4f4;
		padding: 1em;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-family: monospace;
		overflow-x: auto;
	}
</style>
