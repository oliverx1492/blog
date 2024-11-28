<script setup>
import { ref } from 'vue';
import router from '../router';

    //Anmeldedaten
    const username = ref("")
    const password = ref("")
    const password_rpt = ref("")


    const link = "https://blog-mdsr.onrender.com"
    //Fehlermeldung
    const errorMessage = ref("")
    //Erfolgsmeldung
    const successMessage = ref("")

    const createUser = async (props) => {
        console.log(props)

        //Call ans Backend
        try {
            const response = await fetch(`${link}/signup`, {
                method: "POST",
                headers: {
                    "Content-type":"application/json"
                },
                body: JSON.stringify(props)

            })

            if(response.ok) {
                console.log("Erfolgreich")
                const data = await response.json()
                console.log(data.message)
                successMessage.value = data.message
                setTimeout( ()=> {
                    router.push("/login")
                },2000 )
            }

            else {
                console.log("nicht erfolgreich")
                const data = await response.json()
                console.log(data.message)
                errorMessage.value = data.message
            }

        }

        catch(error) {
            console.error("Fehler aufgetreten: ", error)
        }


    }

    const submitForm = async (event) => {
        event.preventDefault();
        errorMessage.value =""

        if(!username.value) {
            errorMessage.value = "Kein Nutzername"
        }

        else if(!password.value) {
            errorMessage.value = "Kein Password"
        }

        else if(password.value !== password_rpt.value) {
            errorMessage.value = "Passwörter stimmen nicht überein"
        
        }

        else {

            console.log("Form submitted")
            console.log(username.value)
            console.log(password.value)

            //Kommunatkion mit Backend
            console.log("Send Data to Backend")
            createUser({username: username.value, password: password.value})
        }
    }

</script>

<template>
    <div class="flex flex-row">

        <div class="lg:w-1/2 w-full h-screen flex justify-center lg:items-center">
            <div class=" lg:border lg:border-sky-800 rounded-lg lg:shadow-md lg:w-1/2 w-screen lg:h-1/2  flex flex-col justify-center items-center m-4 p-4">
                
                <p class="text-sky-800 text-3xl m-2 p-2">Neues Konto erstellen</p>
                <form @submit="submitForm" class="flex flex-col justify-center items-center w-full">
                    <input v-model="username" class="m-2 p-2 w-full h-16 text-center border rounded-lg focus:outline-sky-800 hover:border-sky-700" type="text" placeholder="Username" />
                    <input v-model="password" class="m-2 p-2 w-full h-16 text-center border rounded-lg focus:outline-sky-800 hover:border-sky-700" type="password" placeholder="Passwort" />
                    <input v-model="password_rpt" class="m-2 p-2 w-full h-16 text-center border rounded-lg focus:outline-sky-800 hover:border-sky-700" type="password" placeholder="Passwort wiederholen" />
                    <input class="m-2 p-2 border border-sky-800 rounded-lg h-16 w-1/3 hover:bg-sky-800 hover:text-white transition-all duration-150" type="submit" value="Registrieren"/>
                </form>
                <p class="text-red-400">{{ errorMessage }}</p>
                <p class="text-green-400">{{ successMessage }}</p>
                <p @click="$router.push('/login')" class="text-sm p-4 m-4 cursor-pointer">Im Konto anmelden</p>
            
            </div>
              
        </div>

        <div class="none lg:flex justify-center items-center lg:w-1/2 h-screen bg-sky-800 w-screen">
            <p class="text-center text-white text-8xl font-extrabold tracking-widest">blog</p>
        </div>

      
        
    </div>

    
</template>