<script setup>
import { ref } from 'vue';
import Navbar from './Navbar.vue';
import router from '../router';


const link = "https://blog-mdsr.onrender.com"

const errorMessage = ref("")
const result = ref([])
const keywords = ref("")
const searchMessage = ref("")


const searchForm = (e) => {
    e.preventDefault();
    console.log(keywords.value)
    getResult(keywords.value)
}

const getResult = async (k) => {

    errorMessage.value = ""
    searchMessage.value = ""
    result.value = []

    try {
        const response = await fetch(`${link}/keyword`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ keyword: k })
        })

        if (response.ok) {
            const data = await response.json()
            console.log(data)
            result.value = data.data
            searchMessage.value = `Suchergebnis für: ${k}`

        }

        else {
            const err_data = await response.json()
            console.log(err_data)
            errorMessage.value = err_data.message
        }

    }

    catch (error) {
        console.error("Fehler aufgetreten: ", error)
    }
}

const openPost = (postID) => {
    console.log(postID)
    router.push(`/post/${postID}`)

}


</script>


<template>

    <Navbar />

    <div class="flex flex-col items-center justify-center w-screen">

        <p class="m-4 p-4 text-3xl">Suche</p>
        <form @submit="searchForm" class="w-4/5 flex justify-center items-center">
            <input v-model="keywords" type="text"
                class="m-4 p-4 h-16 w-4/5 text-center border rounded-lg focus:outline-sky-800 hover:border-sky-700" />
            <input type="submit" value="Suchen"
                class="m-2 p-2 border border-sky-800 rounded-lg h-16 w-24 hover:bg-sky-800 hover:text-white transition-all duration-150" />
        </form>

        <!-- error message -->
        <div>
            <p class="text-xl m-2 p-2 text-red-500">{{ errorMessage }}</p>
            <p class="text-lg m-2 p-2">{{ searchMessage }}</p>
        </div>




    </div>

    <div class="flex justify-center" v-for="(post, index) in result" :key="index">
        <div @click="() => openPost(post.id)" class="border border-sky-800 rounded-lg min-h-64 p-4 m-4 lg:w-2/3 w-3/4">
            <p class="text-xs">{{ post.category }}</p>
            <p class="text-xl p-2 m-2">{{ post.author }}</p>
            <p class="text-sm m-2">{{ post.created_at.slice(0, 19) }}</p>
            <hr />
            <p class="text-lg p-2">{{ post.content }}</p>

        </div>
    </div>


</template>