<script setup>
import { onMounted, ref } from 'vue';
import Navbar from './Navbar.vue';
import router from '../router';

    const errorMessage = ref("")

    const username = localStorage.getItem("lsUsername")
    const postings = ref([])

    const getPostings = async (id) => {
        console.log("GETPOSTINGS")
        try {
            const response = await fetch("http://localhost:3000/profile", {
                method: "POST",
                headers: {
                    "Content-type":"application/json"
                },
                body: JSON.stringify({username:username})
            })

            if(response.ok) {
                console.log("Funktioniert")
                const data = await response.json()
                console.log(data.data)
                postings.value = data.data
                if(data.data.length == 0) {
                    errorMessage.value = "Noch kein Posting veröffentlicht"
                }
            }
        }

        catch(error) {
            console.log("Fehler aufgetreten: ", error);
            
        }
    }

    const openPost = (postID) => {
        console.log(postID)
        router.push(`/post/${postID}`)
        // Hier kann der Post geöffnet werden und kommentiert werden, bzw Kommentare angesehen werden
    }

    //Meherer Informationen zum User
    //Vorname, Nachname, Alter, Land

    onMounted( ()=> {
        getPostings(username)
    } )

</script>

<template>

    <Navbar />

    <p class="text-2xl m-4 p-4">Meine Postings</p>
    <p class="text-md m-2 p-2">{{  errorMessage }}</p>
    <div v-for="(post, index) in postings" :key="index">
        <div @click="()=> openPost(post.id)" class="border border-sky-800 rounded-lg h-64 p-4 m-4 w-2/3">
            <p class="text-xl p-2 m-2">{{ post.author }}</p>
            <hr />
            <p class="text-lg p-2">{{ post.content }}</p>
            
        </div>
    </div>


</template>

    <!-- Für das wiedergeben der Posts ist vlt ein eigene Component nützlich -->