<script setup>
import { onMounted, ref } from 'vue';
import router from '../router';
import Navbar from './Navbar.vue';

const category = ref("")

const allPostings = ref([])
const filteredData = ref([])

// Alle Postings werden angezeigt
const getPostings = async () => {
    //Daten werden aus Backend gefetcht, und gefitlert sodass nur die angezeigt werden die nicht vom 
    //anmgemldeten User stammen
    console.log("posting");
    const response = await fetch("http://localhost:3000/getPostings")
    const data = await response.json()
    allPostings.value = data.data.filter((item) => item.author !== localStorage.getItem("lsUsername"))
    filteredData.value = allPostings.value
}

const changeCategory = () => {
    filteredData.value = allPostings.value.filter((item) => item.category == category.value)
    console.log(filteredData.value)
}

const openPost = (postID) => {
    console.log(postID)
    router.push(`/post/${postID}`)
    //Hinzufügen zum Post, Kommentare, Aufrufe, Likes oä
}

onMounted(() => {
    getPostings()
})

</script>

<template>

    <Navbar />
    <div class="flex items-center">
        <p class="text-xm m-2 p-2">Filter:</p>
        <select @change="changeCategory" v-model="category"
            class="border border-sky-800 rounded-lg m-2 p-2 lg:w-1/3 w-full">
            <option value="Politik">Politik</option>
            <option value="Sport">Sport</option>
            <option value="Technologie">Technologie</option>
            <option value="Gesundheit">Gesundheit</option>
            <option value="Musik">Musik</option>
            <option value="Filme">Filme</option>
            <option value="Gaming">Gaming</option>
            <option value="Wirtschaft">Wirtschaft</option>
            <option value="Reisen">Reisen</option>
        </select>
        <p @click="getPostings" class="text-sm cursor-pointer m-2 p-2">Filter löschen</p>
    </div>

    <div v-for="(post, index) in filteredData" :key="index">
        <div @click="() => openPost(post.id)" class="border border-sky-800 rounded-lg h-64 p-4 m-4 w-2/3">
            <p class="text-xs">{{ post.category }}</p>
            <p class="text-xl p-2 m-2">{{ post.author }}</p>
            <hr />
            <p class="text-lg p-2">{{ post.content }}</p>

        </div>
    </div>



</template>