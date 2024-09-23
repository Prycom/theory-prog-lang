type GrammarRule = {
    lhs: string;
    rhs: string[];
}

type Grammar = {
    startSymbol: string;
    rules: Map<string, string[]>;
    terminalSymbols: string[];
}

export function replaceInv(str: string, searchValue: string, replaceValue: string): string {
	const lastIndex = str.lastIndexOf(searchValue);
	if (lastIndex === -1) return str;
	return str.substring(0, lastIndex) + replaceValue + str.substring(lastIndex + searchValue.length);
}



export function leftToRight(grammar: Grammar, minLen: number, maxLen: number, reversed: boolean = false): string[] {
    const chains: string[] = [];
    const chainsProgress: string[] = [];

    const nonTerminalSymbols = Array.from(grammar.rules.keys());

    function gen(currChain: string, currProgress: string) {
        const count = Array.from(currChain).filter(ch => !nonTerminalSymbols.includes(ch)).length;

        if (count > maxLen) {
            return;
        }
        for (const [nonTerminal, terminalSymbols] of grammar.rules) {
            for (const terminal of terminalSymbols) {
                
                if(currChain.includes(nonTerminal)){ // 
                    //console.log(`Current chain: ${currChain}\nNon terminal: ${nonTerminal}\nReplaced with: ${terminal}`)
                    let newChain = ''
                    if(reversed){
                        newChain = replaceInv(currChain, nonTerminal, terminal)
                    }else{
                        newChain = currChain.replace(nonTerminal, terminal)
                    }
                    
                    const newProgress = currProgress + " => " + newChain;
                    
                    if (newChain.length >= minLen && newChain.length <= maxLen
                        && !nonTerminalSymbols.some(nonTermSymb => newChain.includes(nonTermSymb))) {
                        // if no non terminal symbols and normal size of string    
                        chains.push(newChain)
                        chainsProgress.push(newProgress);
                    }
    
                    gen(newChain, newProgress);
    
                }
                

            }

        }
    }
    gen(grammar.startSymbol, grammar.startSymbol);
    return chains.concat(chainsProgress);
}