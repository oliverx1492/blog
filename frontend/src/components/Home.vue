<script setup>
import { ref } from 'vue';
import router from '../router';
    
    const logout = () => {
        localStorage.removeItem("lsId")
        localStorage.removeItem("lsUsername")
        router.push("/login")
    }    

    const greeting = ref("Hallo")
    
</script>

<template>
    {{greeting}}


    <button class="bg-red-400 m-2 p-2" @click="logout">Logout</button>
</template>