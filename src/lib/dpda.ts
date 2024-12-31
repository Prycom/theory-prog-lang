type Transition = [string, string];
type DPDAConfig = {
  states: string[];
  alphabet: string[];
  stackAlphabet: string[];
  transitions: Record<string, Transition[]>;
  startState: string;
  startStackSymbol: string;
  acceptStates: string[];
};

export class DPDA {
  private config: DPDAConfig;
  private currentState: string;
  private stack: string[];

  constructor(config: DPDAConfig) {
    this.config = config;
    this.currentState = config.startState;
    this.stack = [config.startStackSymbol];
  }

  reset(): void {
    this.currentState = this.config.startState;
    this.stack = [this.config.startStackSymbol];
  }

  step(input: string | null): string {
    const stackTop = this.stack[this.stack.length - 1] || "";
    const key = `(${this.currentState}, ${input ?? "λ"}, ${stackTop})`;

    if (!(key in this.config.transitions)) {
      return `No transition for (${this.currentState}, ${input ?? "λ"}, ${stackTop}).`;
    }

    const [nextState, stackOperation] = this.config.transitions[key][0];
    this.currentState = nextState;

    if (stackOperation === "") {
      this.stack.pop();
    } else if (stackOperation.startsWith(stackTop)) {
      this.stack.pop();
      this.stack.push(...stackOperation.slice(stackTop.length).split("").reverse());
    } else {
      this.stack.push(...stackOperation.split("").reverse());
    }

    return `Transition: ${key} -> (${nextState}, ${stackOperation})`;
  }

  accepts(input: string): string[] {
    const logs: string[] = [];
    this.reset();

    for (const symbol of input.split("")) {
      if (!this.config.alphabet.includes(symbol)) {
        return [`Error: Invalid symbol '${symbol}' in input.`];
      }

      const log = this.step(symbol);
      logs.push(log);
      if (log.startsWith("No transition")) return logs;
    }

    while (!this.config.acceptStates.includes(this.currentState) && this.stack.length > 0) {
      const log = this.step(null);
      logs.push(log);
      if (log.startsWith("No transition")) return logs;
    }

    if (this.config.acceptStates.includes(this.currentState)) {
      logs.push("Accepted: Reached accept state.");
    } else {
      logs.push("Rejected: Did not reach accept state.");
    }

    return logs;
  }
}
