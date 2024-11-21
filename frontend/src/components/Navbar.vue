<script setup>
import { onMounted, onUnmounted, onUpdated, ref } from 'vue';
import router from '../router';

const logout = () => {
        localStorage.removeItem("lsId")
        localStorage.removeItem("lsUsername")
        router.push("/login")
    }    

    const username = localStorage.getItem("lsUsername")
    
    const responsive = ref(true)



    const collapseNavbar = () => {
        
        responsive.value = !responsive.value
        
    }

    const navigate = (goto) => {
        router.push(goto)
        responsive.value = false
    }
  

</script>

<template>

    <!-- Collapse für Mobile Ansicht -->
     <div class="m-2 p-2 block lg:hidden">
        <svg @click="collapseNavbar" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#075985" class="size-10">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
        </svg>
     </div>

    <div v-if="responsive" class="flex lg:flex-row flex-col justify-around items-center p-2 mb-6 shadow-lg">
        <p @click="navigate('/')" class="text-lg m-2 p-2 cursor-pointer">Home</p>
        <p @click="navigate('/new')" class="text-lg m-2 p-2 cursor-pointer">Neuer Beitrag</p>
        <p @click="navigate(`/profile/${username}`)" class="text-lg m-2 p-2 cursor-pointer">Mein Profil</p>
        <p class="text-lg m-2 p-2">{{ username }}</p>
        <button class="m-4 p-2 w-24 border border-sky-800 rounded-lg hover:bg-sky-800 hover:text-white transition-all duration-150" @click="logout">Logout</button>
    </div>

</template>