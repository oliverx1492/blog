import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../components/Home.vue"
import Login from "../components/Login.vue";
import { SignatureKind } from "typescript";
import Signup from "../components/Signup.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/home",
        name: "Home",
        component: Home
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    }, 
    {
        path: "/signup",
        name: "Signup",
        component: Signup
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})


export default router