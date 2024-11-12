<script setup>
import router from '../router';

const logout = () => {
        localStorage.removeItem("lsId")
        localStorage.removeItem("lsUsername")
        router.push("/login")
    }    
    
</script>

<template>
    <div class="flex justify-around items-center p-2 mb-6 shadow-lg">
        <p @click="$router.push('/')" class="text-lg m-2 p-2 cursor-pointer">Home</p>
        <p @click="$router.push('/new')" class="text-lg m-2 p-2 cursor-pointer">Neuer Beitrag</p>
        <p @click="$router.push('/profile')" class="text-lg m-2 p-2 cursor-pointer">Mein Profil</p>
        <button class="m-4 p-2 w-24 border border-sky-800 rounded-lg hover:bg-sky-800 hover:text-white transition-all duration-150" @click="logout">Logout</button>


    </div>
</template>