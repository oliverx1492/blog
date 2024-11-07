import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../components/Home.vue"
import Login from "../components/Login.vue";

import Signup from "../components/Signup.vue";
import NewEntry from "../components/NewEntry.vue";
import Profile from "../components/Profile.vue";

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
    },
    {
        path: "/new",
        name: "New",
        component: NewEntry
    },
    {
        path: "/profile",
        name: "Profile",
        component: Profile
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach( (to, from, next) => {
    

    if (!localStorage.getItem("lsId") && to.path !== "/login") {
        next("/login")
    }
    else {
        next()
    }

} )


export default router