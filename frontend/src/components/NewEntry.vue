<script setup>
import { ref } from 'vue';
import router from '../router';
import Navbar from './Navbar.vue';

// Schlagwörter suche

const link = "https://blog-mdsr.onrender.com"

const author = ref("")
const content = ref("")
const category = ref("")
const keywords = ref("")


const errorMessage = ref("")

const publishBlog = async (props) => {
    console.log(props)

    try {
        const response = await fetch(`${link}/new`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(props)
        })

        if (response.ok) {
            const data = await response.json()
            console.log(data.message)
            setTimeout(() => {
                router.push("/")
            }, 500)
        }
        else {
            const data = await response.json()
            console.log(data.message)
        }
    }

    catch (error) {
        console.log("Fehler aufgetreten: ", error)
    }


}

const submitForm = (event) => {
    errorMessage.value = ""
    event.preventDefault();

    const keywordsArray = keywords.value.split(/[,\s]+/).filter(word => word.trim() !== "")
    

    author.value = localStorage.getItem("lsUsername")

    if (!content.value || !category.value) {
        return errorMessage.value = "Überprüfe ob alle Felder ausgefüllt sind"
    }

    console.log("AUTHOR: ", author.value)
    console.log("CONTENT: ", content.value)
    console.log("CATEGORY: ", category.value)
    console.log("Schlüsselwörter: ", keywordsArray)
    publishBlog({ author: author.value, content: content.value, category: category.value, keywords: keywordsArray })


}

</script>

<template>

    <Navbar />
    <div class="flex justify-center  m-2 p-2 h-screen">

        <form @submit="submitForm"
            class="flex items-center flex-col lg:w-2/3 lg:h-3/5 p-4 m-4 lg:border lg:border-sky-800 rounded-lg lg:shadow-md">
            <p class="text-2xl text-center m-2 p-2">Neuen Eintrag erstellen</p>
            <textarea v-model="content" class="m-2 p-2 border h-2/3 w-full rounded-md" type="text"
                placeholder="Text hier einfügen"></textarea>
            
            <input type="text" placeholder="Stichwörter (optional)" v-model="keywords" class="m-2 p-2 border border-sky-800 rounded-md w-full" />
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
                <option value="Bücher">Bücher</option>
                <option value="Sonstige">Sonstige</option>
            </select>

            <input
                class="m-2 p-2 border border-sky-800 rounded-lg h-16 lg:w-1/3 w-2/3 hover:bg-sky-800 hover:text-white transition-all duration-150"
                type="submit" value="Veröffentlichen" />
            <p class="text-red-400 text-center">{{ errorMessage }}</p>
        </form>

    </div>
</template>