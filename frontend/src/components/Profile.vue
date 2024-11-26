<script setup>
import { onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from './Navbar.vue';
import router from '../router';
import PersonalInformation from './PersonalInformation.vue';

const link = "http://localhost:3000"

const errorMessage = ref("")

const filteredData = ref([])
// const username = localStorage.getItem("lsUsername")
const postings = ref([])

const category = ref("")
//sortieren
const sortBy = ref("Älteste zuerst")

const route = useRoute()
const usernameRoute = route.params.username
const username = ref(usernameRoute)

const getPostings = async () => {

    category.value = ""
 
    try {
        const response = await fetch(`${link}/profile`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ username: username.value })
        })

        if (response.ok) {
       
            const data = await response.json()
         

            postings.value = data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            filteredData.value = postings.value

            if (data.data.length == 0) {
                errorMessage.value = "Noch kein Posting veröffentlicht"
            }
        }
    }

    catch (error) {
        console.log("Fehler aufgetreten: ", error);

    }
}

const changeCategory = () => {
   
    filteredData.value = postings.value.filter((item) => item.category == category.value)
    
    //nach Datum sortieren
    
    
}

const openPost = (postID) => {
    
    router.push(`/post/${postID}`)
    // Hier kann der Post geöffnet werden und kommentiert werden, bzw Kommentare angesehen werden
}

const sortData = () => {
    if (sortBy.value === "Älteste zuerst") {

        postings.value = postings.value.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        return sortBy.value = "Neueste zuerst"
    }

    postings.value = postings.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    sortBy.value = "Älteste zuerst"
}

//Meherer Informationen zum User
//Vorname, Nachname, Alter, Land

onMounted(() => {
    getPostings()
})

watch( ()=> route.params.username, 
(newValue, oldValue) => {
    window.location.reload()
} )







</script>

<template>

    <Navbar />

   
    <PersonalInformation />
    

    <div class="flex flex-col items-center justify-center">
        <p class="text-2xl m-2 pt-2">Meine Postings</p>
        <p class="text-md m-2 p-2">{{ errorMessage }}</p>
        <select @change="changeCategory" v-model="category"
            class="border border-sky-800 rounded-lg m-2 p-2 lg:w-1/3 w-5/6 w-full">
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
        <p @click="sortData" class="text-sm cursor-pointer m-2 p-2">Sortieren nach: {{ sortBy }}</p>
    </div>

       <div class="flex justify-center" v-for="(post, index) in filteredData" :key="index">
        <div @click="() => openPost(post.id)" class="border border-sky-800 rounded-lg min-h-64 p-4 m-4 lg:w-2/3">
            <p class="text-xs">{{ post.category }}</p>
            <p class="text-xl p-2 m-2">{{ post.author }}</p>
            <p class="text-sm m-2">{{ post.created_at.slice(0, 19) }}</p>
            <hr />
            <p class="text-lg p-2">{{ post.content }}</p>

        </div>
    </div>



    


</template>

<!-- Für das wiedergeben der Posts ist vlt ein eigene Component nützlich -->