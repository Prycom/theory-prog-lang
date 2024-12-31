<script lang="ts">
	type Rule = {
		rule: { [key: string]: string };
		translate: { [key: string]: string };
	};

	let rules = [
		{
			rule: {
				S: '0S'
			},
			translate: {
				S: 'S0'
			}
		},
		{
			rule: {
				S: '1S'
			},
			translate: {
				S: 'S1'
			}
		},
		{
			rule: {
				S: ''
			},
			translate: {
				S: ''
			}
		}
	];

	let input = '001';
	let inp = 'S';
	let out = 'S';

	

	rules.forEach((rule) => {
		console.log(rule);

	});
</script>

<div class="bg-slate-200 flex flex-col w-full p-6 gap-6">
	<h1 class="text-3xl font-bold underline">СУ перевод</h1>

	<div class="bg-pink-300 flex flex-col w-full gap-4 rounded p-6 shadow-lg">
		<label
			for="input_rules"
			class="font-semibold border-2 w-52 text-center p-2 rounded-lg bg-indigo-300 hover:cursor-pointer"
			>Загрузите правила</label
		>
		<input
			id="input_rules"
			type="file"
			class="border-2 px-2 h-8 w-52 rounded-lg hidden"
			placeholder=""
		/>

		<p class="font-semibold">Загруженные правила:</p>
	</div>

	<div class="bg-pink-300 flex flex-col w-full gap-4 rounded p-6 shadow-lg">
		<div>
			<label for="input_chain" class="font-semibold self-center"
				>Введите цепочку для преобразования:</label
			>
			<input id="input_chain" class="border-2 px-2 h-8 w-52 rounded-lg" placeholder="Цепочка" />
		</div>

		<div>
			<p class="font-semibold">Выходная цепочка:</p>
		</div>
	</div>
</div>
