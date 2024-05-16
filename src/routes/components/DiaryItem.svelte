<script>
	import { onMount } from "svelte";

    export let index;
    export let diary;
    export let date;
    export let editDiary;
    export let removeDiary;


</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
 <!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="diary">
    <p>
        {index + 1}. {diary.text}
    </p>
   
    <div class="actions" on:click|stopPropagation >
        
        <i
            on:click={() => {
                editDiary(date,index);
            }}
            on:keydown={() => {}}
            class="fa-regular fa-pen-to-square"
        />
        <i
            on:click={() => {
                removeDiary(date,index);
            }}
            on:keydown={() => {}}
            class="fa-regular fa-trash-can"
        />
    </div>
</div>

<style>
 
     .diary {
        border-left: 1px solid cyan;
        padding: 8px 14px;
    
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 1.3rem;
    }

    .actions i {
        cursor: pointer;
    }

    .actions i:hover {
        color: coral;
    }
</style>