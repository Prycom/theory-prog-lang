<script lang="ts">
	import { onMount } from 'svelte';
	import { leftToRight, replaceInv } from '$lib/generator';
	import Tree from '../components/Tree.svelte';

	let grammar = {
		startSymbol: 'S',
		rules: new Map([]),
		terminalSymbols: []
	};

	let minLen = 1;
	let maxLen = 5;
	let generatedChains: string[] = [];
	let ltr = false

	let ruleName = '';
	let ruleTerminal = '';
    let newTermSym = '';


	function generateChains() {
		generatedChains = leftToRight(grammar, minLen, maxLen, !ltr);
	}

	function addRule() {
		const key = ruleName.trim();
		const values = ruleTerminal.trim().split('|');

		if (key && values.length > 0) {
			grammar = {
				...grammar,
				rules: new Map(grammar.rules.set(key, values))
			};
		}

        ruleName = ''
        ruleTerminal = ''
	}

    function addTermSymb(){
        const term = newTermSym.trim()
        const terms = grammar.terminalSymbols;
        if(term.length > 0){
            grammar = {
                ...grammar,
                terminalSymbols: [...grammar.terminalSymbols, term]
            }
        }
        newTermSym = ''
    }

</script>

<div class="flex w-full h-24 bg-slate-300">
	<h1 class="block m-auto text-2xl font-bold">
		Бригада #3: Бойко<span class="text-yellow-500">⚡⚡</span>,
		<span class="text-red-500">Горохов❤️</span>
	</h1>
</div>

<h2 class="text-xl font-semibold my-6">Лабораторная #1</h2>

<button class="italic my-4 mx-4" on:click={() => console.log(grammar, ltr)}>[!] Debug INFO</button>
<h3 class="text-md font-semibold">Grammar</h3>
<div>
	<label for="start_sym">Start Symbol: </label>
	<input id="start_sym" class="border-2" bind:value={grammar.startSymbol} />
</div>
<h3 class="font-semibold">Rules:</h3>
<button class="border-2 bg-gray-300" on:click={addRule}>Add new rule</button>

<input placeholder="Rule name A" bind:value={ruleName} />
<input placeholder="Rule aA|...." bind:value={ruleTerminal} />

<div class='border-2 p-4'>
	{#each grammar.rules as [nonTerminalSyms, terminalSyms]}
		<span class="block border-b-2 mx-2">{nonTerminalSyms}</span>
		{#each terminalSyms as termSym}
			<span class="block mx-4">{termSym}</span>
		{/each}
	{/each}
</div>




<h3 class="font-semibold">Terminal Symbols:</h3>

<button class="border-2 bg-gray-300" on:click={addTermSymb}>Add new terminal symbol</button>
<input placeholder="Your terminal symbol" bind:value={newTermSym} />
<div>
    {#each grammar.terminalSymbols as termSymb}
        <span class='block border-b-2 mx-2'>{termSymb}</span>
    {/each}
</div>

<h3 class="font-semibold">Left To Right: </h3>
<input type="checkbox" value={ltr} on:change={()=>ltr=!ltr} />

<form on:submit|preventDefault={generateChains} class="mb-4">
	<div class="m-4">
		<label for="minLength">Min Length:</label>
		<input type="number" id="minLength" bind:value={minLen} />

		<label for="maxLength">Max Length:</label>
		<input type="number" id="maxLength" bind:value={maxLen} />

		<button type="submit" class="border-gray-400 border-2">Generate Chains</button>
	</div>
</form>

{#if generatedChains.length > 0}
	<h2>Generated Chains:</h2>
	<ul class="">
		{#each generatedChains as chain}
			<li class="border-b-2">{chain}</li>
		{/each}
	</ul>

{/if}


<Tree />