<script>
  import { Shadow } from "svelte-loading-spinners";
  import query_ddb from "./query";
  let query = "";
  let results = [];

  let num_queries = 0;
  let last_q = 0;

  let timer;
  const debounce = (q) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      num_queries += 1;
      let my_query = num_queries;

      query_ddb(q)
        .then((data) => {
          if (data && last_q < my_query) {
            last_q = my_query;
            results = data;
          }
        })
        .catch((err) => {
          console.log(err);
          last_q = my_query;
          results = [];
        });
    }, 300);
  };

  $: debounce(query);
</script>

<div class="filter">
  <input
    type="text"
    bind:value={query}
    autofocus
    placeholder="filter diffusiondb"
  />
</div>
<output>{results.length} results</output>
{#if last_q < num_queries}
  <div id="foo"><Shadow size="200" color="#ffdd00" /></div>
{/if}
<ul class="grid">
  {#each results as result (result.id)}
    <li class="prompt">
      <a
        href="https://diffusiondb.m4ke.org/{result.id}.png"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="https://diffusiondb.m4ke.org/{result.id}.jpg"
          alt={result.p}
          title={result.p}
          width="256"
          height="256"
          loading="lazy"
        />
      </a>
    </li>
  {/each}
</ul>

<style>
  ul.grid {
    display: grid;
    /* grid-template-columns: repeat(4, 1fr); */
    grid-template-columns: repeat(auto-fit, minmax(256px, 1fr));

    grid-template-rows: masonry;
    list-style: none;
    margin: 0;
  }

  li.prompt {
    margin: 5px;
    transition: transform 0.2s linear;
  }

  .prompt:hover {
    transform: translateY(-1px);
  }

  .prompt img {
    object-fit: cover;
    border-radius: 10px;
  }

  .filter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 1rem 0;
  }

  input {
    flex-grow: 1;
    font-size: 2em;
    border-radius: 25px;
  }

  output {
    font-size: 2em;
    color: #333;
    margin-left: 1em;
  }

  #foo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
