<script setup>
import { onMounted, ref } from 'vue';
import router from '../router';
import Navbar from './Navbar.vue';

const link = "http://localhost:3000"

const category = ref("")

const allPostings = ref([])
const filteredData = ref([])


const sortBy = ref("Älteste zuerst")

// Alle Postings werden angezeigt
const getPostings = async () => {
    //Daten werden aus Backend gefetcht, und gefitlert sodass nur die angezeigt werden die nicht vom 
    //anmgemldeten User stammen
    category.value = ""
    const response = await fetch(`${link}/getPostings`)
    const data = await response.json()
    allPostings.value = data.data.filter((item) => item.author !== localStorage.getItem("lsUsername"))

    //Neueste zuerst sortieren
    allPostings.value.sort( (a,b) => new Date(b.created_at) - new Date(a.created_at) )
    
    filteredData.value = allPostings.value
}

const changeCategory = () => {
    filteredData.value = allPostings.value.filter((item) => item.category == category.value)
    
    //nach Datum sortieren
    
    console.log(filteredData.value)
}

const openPost = (postID) => {
    console.log(postID)
    router.push(`/post/${postID}`)
    
}

const sortData = () => {
    if(sortBy.value === "Älteste zuerst") {

        filteredData.value = filteredData.value.sort( (a,b) => new Date(a.created_at) - new Date(b.created_at) )
        return sortBy.value = "Neueste zuerst"
    }

    filteredData.value = filteredData.value.sort( (a,b) => new Date(b.created_at) - new Date(a.created_at) )
    sortBy.value = "Älteste zuerst"
}

onMounted(() => {
    getPostings()
})

</script>

<template>
    

    <Navbar />
    <div class="flex flex-col items-center justify-center">
        <p class="text-5xl p-6 m-6">Feed</p>
        <p class="text-xm m-2 p-2">Filter:</p>

        <select @change="changeCategory" v-model="category"
            class="border border-sky-800 rounded-lg m-2 p-2 lg:w-1/3 w-5/6">
            <option value="Politik">Politik</option>
            <option value="Sport">Sport</option>
            <option value="Technologie">Technologie</option>
            <option value="Gesundheit">Gesundheit</option>
            <option value="Musik">Musik</option>
            <option value="Filme">Filme</option>
            <option value="Gaming">Gaming</option>
            <option value="Wirtschaft">Wirtschaft</option>
            <option value="Reisen">Reisen</option>
            <option value="Bücher">Bücher</option>
        </select>

        <p @click="getPostings" class="text-sm cursor-pointer m-2 p-2">Filter löschen</p>

        <p @click="sortData" class="text-sm cursor-pointer m-2 p-2">Sortieren nach: {{sortBy}}</p>
        
    </div>

    <div class="flex justify-center" v-for="(post, index) in filteredData" :key="index">
        <div @click="() => openPost(post.id)" class="border border-sky-800 rounded-lg min-h-64 p-4 m-4 lg:w-2/3 w-3/4">
            <p class="text-xs">{{ post.category }}</p>
            <p class="text-xl p-2 m-2">{{ post.author }}</p>
            <p class="text-sm m-2">{{post.created_at.slice(0,19) }}</p>  
            <hr />
            <p class="text-lg p-2">{{ post.content }}</p>

        </div>
    </div>



</template>