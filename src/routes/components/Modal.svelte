<script>
    export let showModal = false;
    export let modalContent = '';
    export let onSave;
    export let onClose;

    function save() {
        onSave(modalContent);
        onClose(); // Close modal after save
    }
</script>

{#if showModal}
<div class="modal-overlay">
    <div class="modal">
        <button class="close-btn" on:click={onClose}>×</button>
        <textarea bind:value={modalContent}></textarea>
        <button on:click={save}>Save</button>
    </div>
</div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal {
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 300px;
        position: relative;
    }
    .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        border: none;
        background: none;
        font-size: 24px;
        cursor: pointer;
    }
    textarea {
        width: 100%;
        height: 100px;
    }
    button {
        display: block;
        margin: 10px auto;
        padding: 5px 20px;
    }
</style>