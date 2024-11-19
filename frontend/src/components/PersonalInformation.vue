<script setup>
import { onMounted, ref } from 'vue';


const changeToggle = ref(false)
const buttonText = ref("Ändern")

const id = localStorage.getItem("lsId")

const firstName = ref("")
const lastName = ref("")
const age = ref("")
const country = ref("")
const bio = ref("")
const pictureLink = ref("")

const username = localStorage.getItem("lsUsername")

// Persönliche Daten aus den Backend abgerufen
const getProfileData = async () => {
    
    try {
        const response = await fetch("http://localhost:3000/getProfileData", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ id: id })
        })

        if (response.ok) {
            const data = await response.json()
            console.log(data.message)

            // Daten aus dem Backend zurndnen
            firstName.value = data.message.firstname
            lastName.value = data.message.lastname
            age.value = data.message.age
            country.value = data.message.country
            bio.value = data.message.bio
            pictureLink.value = data.message.picturelink
        }


        else {
            const data = await response.json()
            console.log(data)
        }
    }

    catch (err) {
        console.log(err)
    }
}

// Persönliche Daten ändern
const changeProfileData = async (inputData) => {
    try {
        const response = await fetch("http://localhost:3000/changeProfileData", {
            method: "POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify(inputData)
        })

        if(response.ok) {
            const data = await response.json()
            console.log(data)
        }

        else {
            const data = await response.json()
            console.log("Fehler aufgrteten: ", data)
        }

    }

    catch(err) {
        console.log(err)
    }
}

const handleInput = async () => {
    
    const inputData = {id: localStorage.getItem("lsId"), firstname: firstName.value, lastname: lastName.value, age: age.value, country: country.value, bio: bio.value, picturelink: pictureLink.value}
    changeProfileData(inputData)
}

const changeInfos = () => {
    changeToggle.value = !changeToggle.value

    if (buttonText.value !== "Ändern") {
        // Bearbeitungs modus
        console.log("Gespeichert")
        handleInput()
        buttonText.value = "Ändern"

    }

    else {

        buttonText.value = "Speichern"

    }


}

onMounted(() => {
    getProfileData()
})

</script>

<template>
    <div class="flex flex-col items-center justify-center m-2 p-2">
        <p class="m-2 p-2 text-2xl">Persönliche Infos</p>

        <!-- Informationen einsehen -->
        <div v-if="!changeToggle" class="border rounded-md border-sky-800 w-1/2 flex flex-col">
            <div class="flex justify-center items-center">
                <img class="h-48 rounded-full m-4 " :src="pictureLink" alt="Profilebild" />
                <p class="m-2 font-bold text-2xl">@{{ username }}</p>
                
            </div>
            <hr />
            <div class="flex m-4 p-4 border rounded-md">
                <p>{{ bio }}</p>
            </div>

            <div class="flex justify-around m-2 p-2">
                <p class="text-xl">Vorname: {{ firstName }}</p>
                <p class="text-xl">Nachname: {{ lastName }}</p>
            </div>
            
            <div class="flex justify-around m-2 p-2">
                <p class="text-xl">Alter: {{ age }}</p>
                <p class="text-xl">Land: {{ country }}</p>
            </div>
            
            
            
            
        </div>

        <!-- Informationen ändern -->
        <div v-if="changeToggle" class="flex flex-col justify-center w-2/4">
            <div class="flex">
                <input v-model="firstName"
                    class="m-2 p-2 w-full h-12 text-center border rounded-lg focus:outline-sky-800 hover:border-sky-700"
                    type="text" placeholder="Vorname" />
                <input v-model="lastName"
                    class="m-2 p-2 w-full h-12 text-center border rounded-lg focus:outline-sky-800 hover:border-sky-700"
                    type="text" placeholder="Nachname" />
            </div>

            <div class="flex">
                <input v-model="age"
                    class="m-2 p-2 w-full h-12 text-center border rounded-lg focus:outline-sky-800 hover:border-sky-700"
                    type="number" placeholder="Alter" />
                <input v-model="country"
                    class="m-2 p-2 w-full h-12 text-center border rounded-lg focus:outline-sky-800 hover:border-sky-700"
                    type="text" placeholder="Land" />
            </div>

            <div class="flex">
                <textarea v-model="bio"
                    class="m-2 p-2 w-full h-24 text-center border rounded-lg focus:outline-sky-800 hover:border-sky-700"
                    type="text" placeholder="Bio"></textarea>
            </div>

            <div class="flex items-center m-2 p-2">
                <input v-model="pictureLink" placeholder="Link für Profilbild" class="m-2 p-2 w-full h-12 text-center border rounded-lg focus:outline-sky-800 hover:border-sky-700" type="text"/>
            </div>
        </div>


        <button @click="changeInfos"
            class="m-4 p-2 w-24 border border-sky-800 rounded-lg hover:bg-sky-800 hover:text-white transition-all duration-150">{{ buttonText }}</button>


    </div>
</template>