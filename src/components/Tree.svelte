<script>
    let chain = 'S => aA => aaS => aaaA => aaaaS => aaaaaA => aaaaa'
    let elements = chain.split(' => ')

    let rules = {
        'S': ['aA', 'bB'],
        'A': ['aS', ''],
        'B': ['bB', '']
    }

</script>

<div class='w-full border-2'>

    {#each elements as el}
        <span class='block m-2'>{el}</span>  
        <span class='block'>👇🏿</span>
        {#each Object.entries(rules) as [k, v]}
            {#if el.includes(k)}
                
                {#each v as variant}
                    <span class='inline-block m-2'>{el.replace(k, variant)}</span>
                {/each}

            {/if}
        {/each}
    {/each}
</div>
