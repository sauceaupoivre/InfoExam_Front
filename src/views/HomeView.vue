<script>
import { defineComponent } from 'vue'
import axios from "axios";


export default defineComponent({
    name: "HomeView",
    data(){
      return {
        apiUrl: "",
        allCartouches : [],
      }
    },
    mounted() {
            this.apiUrl = import.meta.env.VITE_API_URL
            axios.get(this.apiUrl + "cartouches/all")
                .then(
                    (response) => {
                        this.allCartouches = response.data;
                    }
                )
                .catch(
                    (error) => {
                        console.log("Erreur: ", error)
                    }
                )
      }
})
</script>

<template>
  <main>
   
    <div v-for="currentCartouche in this.allCartouches">
        <p>{{ currentCartouche.id }}</p>
    </div>
    
  </main>
</template>
