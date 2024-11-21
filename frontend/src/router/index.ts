import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../components/Home.vue"
import Login from "../components/Login.vue";

import Signup from "../components/Signup.vue";
import NewEntry from "../components/NewEntry.vue";
import Profile from "../components/Profile.vue";
import Post from "../components/Post.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
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
        path: "/profile/:username",
        name: "Profile",
        component: Profile
    },
    {
        path: "/post/:id",
        name: "Post",
        component: Post
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    // Überprüfen, ob der Benutzer eingeloggt ist, indem wir nach "lsId" im localStorage suchen
    const isLoggedIn = !!localStorage.getItem("lsId");
  
    // Wenn der Benutzer nicht eingeloggt ist und versucht, auf die Hauptseite ("/") oder eine andere geschützte Route zuzugreifen
    if (!isLoggedIn && to.path !== "/login" && to.path !== "/signup") {
      // Umleitung zur Login-Seite
      next("/login");
    } else {
      // Andernfalls die Navigation fortsetzen
      next();
    }
  });


export default router