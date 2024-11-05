import { reactive } from "vue";

interface Store {
    isLoggedIn: boolean
}

export const store = reactive<Store>({
    isLoggedIn: false
})