<script setup>
import { onMounted, ref } from 'vue';


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
            }
        }

        catch(error) {
            console.log("Fehler aufgetreten: ", error);
            
        }
    }

    const openPost = (id) => {
        console.log(id)
        // Hier kann der Post geöffnet werden und kommentiert werden, bzw Kommentare angesehen werden
    }

    onMounted( ()=> {
        getPostings(username)
    } )

</script>

<template>
    <p class="text-2xl m-4 p-4">Meine Postings</p>

    <div v-for="(post, index) in postings" :key="index">
        <div @click="()=> openPost(post.id)" class="border border-sky-800 rounded-lg h-64 p-4 m-4 w-2/3">
            <p class="text-xl p-2 m-2">{{ post.author }}</p>
            <hr />
            <p class="text-lg p-2">{{ post.content }}</p>
            
        </div>
    </div>


</template>

    <!-- Für das wiedergeben der Posts ist vlt ein eigene Component nützlich -->