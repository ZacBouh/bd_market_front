import { createStore } from "jotai";
import { userAtom } from "./auth";

const store = createStore()

export { store, userAtom }