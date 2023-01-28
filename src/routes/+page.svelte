<script>
  import { useInit } from '../lib/utils/instant-db-helpers'

  const APP_ID = '82caf185-a700-4755-873a-23fcc3d862cc'

  const db = useInit({
    appId: APP_ID,
    websocketURI: 'wss://api.instantdb.com/runtime/sync',
    apiURI: 'https://api.instantdb.com',
  })

  $: console.log($db)
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
