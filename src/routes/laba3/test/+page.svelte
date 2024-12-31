<script lang="ts">
    import { DPDA } from "$lib/dpda";
    import { onMount } from "svelte";
  
    let dpdaConfig: string = "";
    let chain: string = "";
    let resultLogs: string[] = [];
    let dpda: DPDA | null = null;
  
    function loadDPDA() {
      try {
        const config = JSON.parse(dpdaConfig);
        dpda = new DPDA(config);
        resultLogs = ["DPDA loaded successfully."];
      } catch (e) {
        resultLogs = ["Error: Invalid DPDA configuration."];
      }
    }
  
    function checkChain() {
      if (dpda) {
        resultLogs = dpda.accepts(chain);
      } else {
        resultLogs = ["Error: DPDA not loaded."];
      }
    }
  </script>
  
  <div class="p-4 space-y-4">
    <h1 class="text-xl font-bold">DPDA Checker</h1>
  
    <textarea
      class="w-full p-2 border rounded"
      placeholder="Enter DPDA configuration as JSON..."
      bind:value={dpdaConfig}
    ></textarea>
    <button
      class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      on:click={loadDPDA}
    >
      Load DPDA
    </button>
  
    <input
      type="text"
      class="w-full p-2 border rounded"
      placeholder="Enter chain to check..."
      bind:value={chain}
    />
    <button
      class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
      on:click={checkChain}
    >
      Check Chain
    </button>
  
    <div class="mt-4">
      <h2 class="text-lg font-semibold">Result:</h2>
      <ul class="list-disc list-inside">
        {#each resultLogs as log}
          <li>{log}</li>
        {/each}
      </ul>
    </div>
  </div>
  