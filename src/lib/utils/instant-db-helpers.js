import ReactiveDB, { optimisticStore } from "@instantdb/react/dist/ReactiveDB"
import { assertUnreachable } from "@instantdb/react/dist/util/error"

import { assert } from "@instantdb/react/dist/util/error"
import * as uuid from "uuid"
//import * as r from "./react";
import * as instatx from "@instantdb/react/dist/instatx"
import * as instaql from "@instantdb/react/dist/instaql"
import * as authAPI from "@instantdb/react/dist/auth"

/**
 * @typedef {import("@instantdb/react/dist/instatx").TransactionChunk} TransactionChunk
 * @typedef {import("@instantdb/react/dist/ReactiveDB").default} ReactiveDB
 * @typedef {import("@instantdb/react/dist/ReactiveDB").Auth} Auth
 * @typedef {import("@instantdb/react/dist/ReactiveDB").InstaQL} InstaQL
 * @typedef {import("@instantdb/react/dist/ReactiveDB").QueryResponse} QueryResponse
 * @typedef {import("@instantdb/react/dist/ReactiveDB").State} State
 * @typedef {import("@instantdb/react/dist/ReactiveDB").Config} Config
 */

// ------
// Global

/**
 * @type {ReactiveDB | null}
 */
let _GLOBAL_DB = null;

/**
 * @returns {ReactiveDB | null}
 */
export function globalDBAsserting() {
  assert(_GLOBAL_DB != null, "You must `init` first");
  return _GLOBAL_DB;
}

// -----
// React

/**
 * 
 * @returns {string}
 */
export function id() {
  return uuid.v4();
}


/**
 * @param {InstaQL} q
 */
export function query(q) {
  const db = globalDBAsserting();

  if (db?.state.status !== "online" && db?.state.status !== "offline") {
    return {};
  }

  return instaql.query(q, optimisticStore(db.state));
}

// export function useQuery(q: InstaQL) {
//   return r.useQuery(q, globalDBAsserting());
// }

/**
 * @param {Config} config
 * @returns {ReactiveDB}
 */
export function useInit(config) {
  if (!_GLOBAL_DB) {
    _GLOBAL_DB = new ReactiveDB(config);
  }
  _GLOBAL_DB.start()
  // _GLOBAL_DB.subscribe((state) => {
  //   console.log(state)
  // })
  return _GLOBAL_DB
}

// -----
// Auth

export const auth = {
  //{ email: string }
  sendMagicCode({ email }) {
    const db = globalDBAsserting();
    return authAPI.sendMagicCode({
      apiURI: db.config.apiURI,
      appId: db.config.appId,
      email: email,
    });
  },
  //{ email: string; code: string }
  verifyMagicCode({ email, code }) {
    const db = globalDBAsserting();
    return authAPI.verifyMagicCode({
      apiURI: db.config.apiURI,
      appId: db.config.appId,
      email,
      code,
    });
  },
  signOut() {
    const db = globalDBAsserting();
    authAPI.signOut({ appId: db.config.appId });
  },
};

// --------
// Transact

export const tx = instatx.tx;

/**
 * @param {instatx.TransactionChunk | instatx.TransactionChunk[]} x
 */
export function transact(x) {
  globalDBAsserting().pushTx(x);
}