<script>
   import { authHandlers } from "../../store/store.js";

let email = "";
let password = "";
let confirm = "";
let error = false;
let login = true;
let authenticating = false;
let errmsg=""
async function handleAuthenticate() {
    if (authenticating) {
        return;
    }
    if (!email || !password || (!login && !confirm)) {
        error = true;
        return;
    }
    authenticating = true;

    try {
        if (login) {
            await authHandlers.login(email, password);
        } else {
            await authHandlers.signup(email, password);
        }
    } catch (err) {
        console.log("There was an auth error",err.code );
        errmsg=err.code
        error = true;
        authenticating = false;
    }
}
</script>
 <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="authContainer">
<form>
    {#if error}
    <p class="error">{errmsg}</p>
    {/if}
    <h1>{login ?"Login" : "Register"}</h1>
    <label>
        <input bind:value={email} type="email" placeholder="Email">
    </label>
    <label>
        <input bind:value={password} type="password" placeholder="Password">
    </label>
    {#if !(login)}
    <label>
        <input bind:value={confirm} type="password" placeholder="Confirm Password">
    </label>
    {/if}
    <button on:click={handleAuthenticate} type="button" class="submitBtn">
        {#if authenticating}
            <i class="fa-solid fa-spinner loadingSpinner" />
        {:else}
            Submit
        {/if}
    </button>
</form>
<div class="options">
    {#if !(login)}
    <div>
        <p>Already Have an Account ?</p> 
           
            <p on:click={()=>(login=!login)}>Login</p>
    </div>
    {:else}
    <div>
        <p>Dont Have an Account ?</p> 
           
            <p on:click={()=>(login=!login)}>Register</p>
    </div>
    {/if}
</div>
</div>
<style>
    .error{
        color: red;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .authContainer{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px;
    }
    form{
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 400px;
        max-width: 100%;
        margin: 0 auto;
    }
    form input{
        width: 100%;
        height: 40px;
        border-radius: 6px;
        padding: 5px;
    }
    h1{
        text-align: center;
    }
    button{
        width: 50%;
        align-self: center;
        height: 40px;
        border-radius: 6px;
        font-weight: bolder;
    }
    button:hover{
        scale:1.1 ;
        transition:all 200ms ease-in;
    }
    .options{
       padding: 14px;
    }
    .options>div{
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

</style>