<script>
  import { useInit, tx, transact } from '../lib/utils/instant-db-helpers'
  import * as instaql from "@instantdb/react/src/instaql"
  import { optimisticStore } from '@instantdb/react/dist/ReactiveDB'
  import { onMount } from 'svelte'

  const APP_ID = '82caf185-a700-4755-873a-23fcc3d862cc'

  const db = useInit({
    appId: APP_ID,
    websocketURI: 'wss://api.instantdb.com/runtime/sync',
    apiURI: 'https://api.instantdb.com',
  })

  const query = {
    counter: {
      $: {
        where: {
          id: 'singleton',
        },
        cardinality: 'one',
      },
    },
  }
  //const { counter } = useQuery(query)
  let count = 0//counter?.count || 0

  $: console.log($db)

  $: if ($db) {
    const test = instaql.query(query, optimisticStore(db.state))
    console.log(test)
    count = test.counter.count
  }

  $: if ($db?.status === 'online' && count === 0) {
    //transact([tx.counter['singleton'].update({ count: 1 })])
  }
</script>

<button
  on:click={() => transact([tx.counter['singleton'].update({ count: count + 1 })])}
>{count}</button>
