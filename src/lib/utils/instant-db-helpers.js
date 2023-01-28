import ReactiveDB, { optimisticStore } from "@instantdb/react/dist/ReactiveDB"
import { assertUnreachable } from "@instantdb/react/dist/util/error"
import { writable } from "svelte/store"

/**
 * @typedef {import("@instantdb/react/dist/ReactiveDB").Auth} Auth
 * @typedef {import("@instantdb/react/dist/ReactiveDB").InstaQL} InstaQL
 * @typedef {import("@instantdb/react/dist/ReactiveDB").QueryResponse} QueryResponse
 * @typedef {import("@instantdb/react/dist/ReactiveDB").State} State
 * @typedef {[boolean, Error|undefined, Auth|undefined]} InitState
 * @typedef {import("@instantdb/react/dist/ReactiveDB").Config} Config
 * @typedef {import("svelte/store").Writable<InitState>} WritableState
 */

/**
 * @param {State} state
 * @returns {InitState}
 */
function initState(state) {
  switch (state.status) {
    case "not-started":
    case "connecting":
      return [true, undefined, undefined];
    case "shutdown":
    case "error":
      return [false, new Error(state.message), undefined];
    case "online":
    case "offline":
      return [false, undefined, state.auth];
    default:
      assertUnreachable(state);
  }
}

/**
 * @param {Config} config
 * @returns {WritableState}
 */
export function useInit(config) {
  const db = new ReactiveDB(config)
  db.start();
  //@todo: I think I need to learn how to make a custom store out of this.
  const state = writable(db)
  //const [state, setState] = useState(initState(db.state));
  //   const unsub = db.subscribe((state) => {
  //     setState(initState(state));
  //   });
  //   return unsub;
  // }, []);
  return state;
}