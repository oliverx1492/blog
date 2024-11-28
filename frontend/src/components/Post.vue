<script setup>
import { useRoute, useRouter } from 'vue-router';
import Navbar from './Navbar.vue';
import { onMounted, ref } from 'vue';
import router from '../router';

const link = "http://localhost:3000"

const route = useRoute()
const id = route.params.id
const post = ref([])
const errorMessage = ref("")
const noComments = ref("")
const comment = ref("")

// Toogle Kommetare View
const showComments = ref(false)
const showCommentsMessage = ref("Kommentare anzeigen")

//Aus Backend fetchen und ein Input für Kommentare verwenden
const getPostDetail = async (postID) => {

    comment.value = ""

    try {
        const response = await fetch(`${link}/postDetail`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ postID: postID })
        })

        if (response.ok) {
            const data = await response.json()
            console.log(data.data)
            post.value = data.data
            console.log("PV: ", post.value[0].id)
            if(post.value[0].comments == null) {
                noComments.value = "Noch keine Kommentare"
            }
            console.log("Kommentare: ", post.value[0].comments)
        }

        else {
            console.log("Response not okay")
            const data = await response.json()
            console.log(data.message)
        }
    }

    catch (err) {
        console.error("Fehler aufgetreten: ", err)
    }



}

const fetchComment = async (commentData) => {
    try {
        const response = await fetch(`${link}/newComment`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(commentData)
        })

        if (response.ok) {
            const data = await response.json()
            console.log(data)
            getPostDetail(id)
        }

        else {
            const data = await response.json()
            console.log(data)
        }
    }

    catch (err) {
        console.error(err);

    }
}

const submitComment = (e) => {
    e.preventDefault();
    errorMessage.value = ""
    if (!comment.value) {
        return errorMessage.value = "Kein Kommentar"
    }
    console.log(comment.value)
    console.log("Author: ", localStorage.getItem("lsUsername"))
    console.log("POST ID: ", id)
    const username = localStorage.getItem("lsUsername")
    

    // Backend route definieren
    fetchComment({ postID: id, author: username, comment: comment.value })
}

const toggleComments = () => {
    showComments.value = !showComments.value
    if(showComments.value) {
        return showCommentsMessage.value = "Kommentare einklappen"
    }
    showCommentsMessage.value = "Kommentare anzeigen"
}

onMounted(() => {
    getPostDetail(id)
})



</script>

<template>
    <Navbar />
    <div class="flex flex-col justify-center items-center">

        Post {{ id }}


        <div v-for="(item, index) in post" :key="index" class="lg:w-2/3">
            <div class="lg:border lg:border-sky-800 rounded-lg p-4 m-4 ">
                <!-- Post -->
                <div class="min-h-64">
                    <p class="text-xs">{{ item.category }}</p>
                    <p @click="$router.push(`/profile/${item.author}`)" class="cursor-pointer text-3xl p-2 m-2">{{ item.author }}</p>
                    <p class="text-sm m-2">{{item.created_at.slice(0,19) }}</p>  
                    <hr />
                    <div class="p-2 m-2 bg-gray-50 min-h-64 rounded-md">
                    <p class="text-lg p-2">{{ item.content }}</p>
                </div>
                </div>

                <p @click="toggleComments" class="text-sm p-2 m-2 text-sky-800 cursor-pointer">{{ showCommentsMessage }}</p>
                <!-- Kommentare -->
                
                <div v-if="showComments">
                    <p class="m-2 p-2 text-md text-center">{{ noComments }}</p>
                <div  class="flex justify-end" v-for="(item, indexComm) in post[index].comments" :key="indexComm">
                   
                    <div class="border rounded-md flex flex-col m-2 p-2 lg:w-2/3 w-full">
                        <!-- Name -->
                        <div>
                            <p @click="router.push(`/profile/${item.author}`)" class="m-2 p-2 cursor-pointer">{{ item.author }}</p>
                            <hr /> 
                        </div>

                        <!-- Content -->
                        <div class="p-2 m-4">
                            <p>{{ item.comment }}</p>
                        </div>

                    </div>

                </div>
            </div>

                <!-- Kommentar schreiben -->
                <hr />
                <form @submit="submitComment" class="flex lg:flex-row flex-col justify-around items-center p-4 m-4">
                    <input v-model="comment" type="text"
                        class="m-2 p-2 lg:w-4/5 w-full h-16 text-center border rounded-lg focus:outline-sky-800 hover:border-sky-700"
                        placeholder="Kommentar hinzufügen" />
                    <input type="submit"
                        class="m-4 p-2 lg:w-1/5 h-16 border border-sky-800 rounded-lg hover:bg-sky-800 hover:text-white transition-all duration-150"
                        value="Kommentieren" />
                </form>
                {{ errorMessage }}
            </div>
        </div>
    </div>
</template>