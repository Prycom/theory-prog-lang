<script lang="ts">
    let inputString = ''; // Входная цепочка
    let rulesText = ''; // Текст с правилами автомата
    let result: string[] = []; // Лог шагов автомата
    let error: string = '';
  
    // Обработка файла с правилами
    const loadRules = async (file: File) => {
      const text = await file.text();
      rulesText = text;
    };
  
    // Структура для правил автомата
    interface Rule {
      currentState: string;
      inputSymbol: string;
      stackTop: string;
      nextState: string;
      stackAction: string;
      outputSymbol: string;
    }
  
    // Парсинг правил из строки
    const parseRules = (input: string): Rule[] => {
      const lines = input.trim().split('\n');
      const rules: Rule[] = [];
      for (const line of lines) {
        const [currentState, inputSymbol, stackTop, nextState, stackAction, outputSymbol] = line.split(' ');
        if (line.trim() && line.split(' ').length === 6) {
          rules.push({ currentState, inputSymbol, stackTop, nextState, stackAction, outputSymbol });
        } else {
          throw new Error(`Некорректное правило: ${line}`);
        }
      }
      return rules;
    };
  
    // Обработка цепочки согласно правилам
    const processString = (input: string, rules: Rule[]): string[] => {
      const steps: string[] = [];
      const stack: string[] = ['Z']; // Инициализация стека
      let currentState = 'q0';
      let pointer = 0;
  
      while (pointer <= input.length) {
        const inputSymbol = pointer < input.length ? input[pointer] : '_';
        const stackTop = stack.length > 0 ? stack[stack.length - 1] : '_';
  
        // Поиск подходящего правила
        const rule = rules.find(
          (r) =>
            r.currentState === currentState &&
            (r.inputSymbol === inputSymbol || r.inputSymbol === '_') &&
            (r.stackTop === stackTop || r.stackTop === '_')
        );
  
        if (!rule) {
          steps.push(`Нет подходящего правила. Состояние: ${currentState}, символ: ${inputSymbol}, стек: ${stack.join('')}`);
          throw new Error('Обработка завершена с ошибкой: правило не найдено.');
        }
  
        // Лог текущего шага
        steps.push(`(${currentState}, ${inputSymbol}, ${stackTop}) → (${rule.nextState}, ${rule.stackAction}, ${rule.outputSymbol})`);
  
        // Обновляем стек
        if (rule.stackAction === '+') {
          stack.push(rule.outputSymbol);
        } else if (rule.stackAction === '-') {
          stack.pop();
        }
  
        // Переход к следующему состоянию
        currentState = rule.nextState;
  
        // Сдвигаем указатель, если считали символ
        if (rule.inputSymbol !== '_') pointer++;
  
        // Если достигли конечного состояния
        if (currentState === 'qf') {
          steps.push('Цепочка успешно обработана.');
          break;
        }
      }
  
      return steps;
    };
  
    // Запуск автомата
    const runAutomaton = () => {
      try {
        const parsedRules = parseRules(rulesText);
        result = processString(inputString, parsedRules);
        error = '';
      } catch (err) {
        error = (err as Error).message;
      }
    };
  </script>
  
  <h1>Автомат с магазинной памятью</h1>
  
  <!-- Загрузка файла -->
  <div>
    <label>Загрузить файл с правилами:</label>
    <input type="file" accept=".txt" on:change={(e) => loadRules(e.target.files[0])} />
  </div>
  
  <!-- Ввод цепочки -->
  <div>
    <label>Введите цепочку:</label>
    <input type="text" bind:value={inputString} placeholder="Пример: aabb" />
  </div>
  
  <!-- Кнопка запуска -->
  <button on:click={runAutomaton}>Запустить автомат</button>
  
  <!-- Результат -->
  {#if error}
    <p style="color: red;">Ошибка: {error}</p>
  {:else if result.length > 0}
    <h2>Шаги автомата:</h2>
    <ul>
      {#each result as step}
        <li>{step}</li>
      {/each}
    </ul>
  {/if}
  