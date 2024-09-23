<script>
    //export let chain = 'S => aA => aaS => aaaA => aaaaS => aaaaaA => aaaaa'
    //let elements = chain.split(' => ')
    /*
    export let rules = {
        'S': ['aA', 'bB'],
        'A': ['aS', ''],
        'B': ['bB', '']
    }
    */

   export let chain
   export let rules
   let elements = chain.split(' => ')

    console.log(chain, rules, elements, rules.entries())

</script>

<div class='w-full border-2'>

    {#each elements as el}
        <span class='block m-2 border-t-2'>{el}</span>  
        {#each rules.entries() as [k, v]}
            {#if el.includes(k)}
                <span class='block'>👇🏿</span>
                {#each v as variant}
                    <span class='inline-block m-2'>{el.replace(k, variant)}</span>
                {/each}

            {/if}
        {/each}
    {/each}
</div>
