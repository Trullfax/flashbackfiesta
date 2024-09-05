<script>
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    import SuccessIcon from "./SuccessIcon.svelte";
    import ErrorIcon from "./ErrorIcon.svelte";
    import InfoIcon from "./InfoIcon.svelte";
    import CloseIcon from "./CloseIcon.svelte";
  
    const dispatch = createEventDispatcher();
  
    export let type = "error";
    export let dismissible = true;
  </script>
  
  <article class={type} role="alert" transition:fade>
    {#if type === "success"}
      <SuccessIcon width="1.1em" />
    {:else if type === "error"}
      <ErrorIcon width="1.1em" />
    {:else}
      <InfoIcon width="1.1em" />
    {/if}
  
    <div class="text text-[1.25rem] font-contrail">
      <slot />
    </div>
  
    {#if dismissible}
      <button class="close" on:click={() => dispatch("dismiss")}>
        <CloseIcon width="0.8em" />
      </button>
    {/if}
  </article>
  
  <style lang="postcss">
    article {
      color: var(--ff-white);
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      margin: 0 auto 0.5rem auto;
      width: 20rem;
      box-shadow: 5px 5px 0 0 var(--ff-black);
    }
    .error {
      background: var(--ff-red);
    }
    .success {
      background: var(--ff-green);
    }
    .info {
      background: var(-ff-purple);
    }
    .text {
      margin-left: 1rem;
    }
    button {
      color: var(--ff-white);
      background: transparent;
      border: 0 none;
      padding: 0;
      margin: 0 0 0 auto;
      line-height: 1;
      font-size: 1rem;
    }
  </style>
  