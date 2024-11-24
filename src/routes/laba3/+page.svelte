<script lang="ts">
    import { writable } from 'svelte/store';
  
    // Типы данных для ДКА
    type DFA = {
      states: string[];
      alphabet: string[];
      transitions: Record<string, Record<string, string>>; // {state: {symbol: next_state}}
      startState: string;
      finalStates: string[];
    };
  
    type Configuration = {
      currentState: string;
      remainingInput: string;
    };
  
    // Хранилище для ДКА
    const dfa = writable<DFA | null>(null);
  
    // Хранилище для цепочек
    const inputChain = writable<string>('');
    const configurations = writable<Configuration[]>([]);
    const resultMessage = writable<string | null>(null);
  
    // Функция проверки цепочки
    function processChain(chain: string, automaton: DFA) {
      const configs: Configuration[] = [];
      let currentState = automaton.startState;
  
      for (let i = 0; i < chain.length; i++) {
        const symbol = chain[i];
        configs.push({ currentState, remainingInput: chain.slice(i) });
  
        // Проверка символа на принадлежность алфавиту
        if (!automaton.alphabet.includes(symbol)) {
          resultMessage.set(`Error: Symbol '${symbol}' is not in the alphabet.`);
          configurations.set(configs);
          return;
        }
  
        // Переход по функции переходов
        const nextState = automaton.transitions[currentState]?.[symbol];
        if (!nextState) {
          resultMessage.set(
            `Error: No transition defined for state '${currentState}' with input '${symbol}'.`
          );
          configurations.set(configs);
          return;
        }
  
        currentState = nextState;
      }
  
      // Добавляем финальную конфигурацию
      configs.push({ currentState, remainingInput: '' });
  
      // Проверка на принадлежность конечным состояниям
      if (automaton.finalStates.includes(currentState)) {
        resultMessage.set('The chain belongs to the language.');
      } else {
        resultMessage.set(
          `Error: The chain ended in a non-final state '${currentState}'.`
        );
      }
  
      configurations.set(configs);
    }
  
    // Загрузка ДКА
    function loadDFA(input: string) {
      try {
        const parsed: DFA = JSON.parse(input);
        dfa.set(parsed);
        resultMessage.set(null);
        configurations.set([]);
      } catch (error) {
        alert('Invalid DFA format.');
      }
    }
  
    // Пример формата ДКА
    let exampleDFA = JSON.stringify(
      {
        states: ['q0', 'q1', 'q2'],
        alphabet: ['0', '1'],
        transitions: {
          q0: { 0: 'q1', 1: 'q0' },
          q1: { 0: 'q2', 1: 'q0' },
          q2: { 0: 'q2', 1: 'q2' },
        },
        startState: 'q0',
        finalStates: ['q2'],
      },
      null,
      2
    );
  </script>
  
  <style>
    /* Простая стилизация */
    .configurations {
      margin-top: 20px;
    }
  
    .error {
      color: red;
    }
  
    .success {
      color: green;
    }
  </style>
  
  <!-- Главный интерфейс -->
  <div>
    <h1>DFA Chain Validator</h1>
  
    <!-- Ввод ДКА -->
    <div>
      <h2>Load DFA</h2>
      <textarea
        bind:value={exampleDFA}
        rows="10"
        cols="50"
      ></textarea>
      <button on:click={() => loadDFA(exampleDFA)}>Load DFA</button>
    </div>
  
    <!-- Ввод цепочки -->
    {#if $dfa}
      <div>
        <h2>Enter Chain</h2>
        <input
          type="text"
          bind:value={$inputChain}
          placeholder="Enter chain (e.g., 001)"
        />
        <button on:click={() => processChain($inputChain, $dfa)}>Validate</button>
      </div>
    {/if}
  
    <!-- Результаты -->
    {#if $resultMessage}
      <p class={$resultMessage.startsWith('Error') ? 'error' : 'success'}>
        {$resultMessage}
      </p>
    {/if}
  
    <!-- Конфигурации -->
    {#if $configurations.length > 0}
      <div class="configurations">
        <h2>Configurations</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Current State</th>
              <th>Remaining Input</th>
            </tr>
          </thead>
          <tbody>
            {#each $configurations as config}
              <tr>
                <td>{config.currentState}</td>
                <td>{config.remainingInput}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
  