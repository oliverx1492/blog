<script setup>

    import { ref } from 'vue';
import { store } from '../store';
    console.log(store.isLoggedIn)

    //Anmeldedaten
    const username = ref("")
    const password = ref("")

    //Fehlermeldung
    const errorMessage = ref("")

    const loginUser = async (props) => {

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-type":"application/json"
                },
                body: JSON.stringify(props)
            })

            const data = await response.json()
            if(response.ok) {
                console.log(data.message)
            }

            else {
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

        else {

            console.log("Form submitted")
            console.log(username.value)
            console.log(password.value)

            //Kommunkation mit Backend
            loginUser({username: username.value, password: password.value})
        }
    }

</script>

<template>
    <div class="flex flex-row">

        <div class="none lg:block lg:w-1/2 h-screen bg-sky-800">
            
        </div>

        <div class="lg:w-1/2 w-full h-screen flex justify-center lg:items-center">
            <div class=" lg:border lg:border-sky-800 rounded-lg lg:shadow-md lg:w-1/2 w-screen lg:h-1/2  flex flex-col justify-center items-center m-4 p-4">
                
                <p class="text-sky-800 text-3xl m-2 p-2">Login</p>
                <form @submit="submitForm" class="flex flex-col justify-center items-center w-full">
                    <input v-model="username" class="m-2 p-2 w-full h-16 text-center border rounded-lg focus:outline-sky-800 hover:border-sky-700" type="text" placeholder="Username" />
                    <input v-model="password" class="m-2 p-2 w-full h-16 text-center border rounded-lg focus:outline-sky-800 hover:border-sky-700" type="password" placeholder="Passwort" />
                    <input class="m-2 p-2 border border-sky-800 rounded-lg h-16 w-1/3 hover:bg-sky-800 hover:text-white transition-all duration-150" type="submit" value="Anmelden"/>
                </form>
                <p class="text-red-400">{{ errorMessage }}</p>
                <p @click="$router.push('/signup')" class="text-sm p-4 m-4 cursor-pointer">Erstelle einen neuen Account</p>
            
            </div>
              
        </div>
        
    </div>

    
</template>