<script>
import { defineComponent } from 'vue'
import axios from "axios";
import FooterBase from '@/components/FooterBase.vue';

export default defineComponent({
    name: "HomeView",
    components: {
      FooterBase
    },
    data(){
      return {
        apiUrl: "",
        date: "",
        disabled: true,
        loading: false,

        examensSallesByDate : [],
        allCartouches : [],
      }
    },
    methods: {
      isDisabeld(){
        if(this.date == "" || this.examensSallesByDate.length === 0){
          this.disabled = true;
        }else{
          this.disabled = false;
        }
      },
      getSallesByDate(){
        this.loading = true;
        axios.get(this.apiUrl + "cartouches/date/" + this.date)
          .then((response) => {
            this.loading = false;
            this.examensSallesByDate = response.data;})
          .catch((error) => {console.log("Erreur: ", error)})
      }
    },
    mounted() {
      this.apiUrl = import.meta.env.VITE_API_URL
    },
    updated(){
      this.isDisabeld();
    }
})
</script>

<template>
  <main>
    <div class="w-75 m-auto">
        <h3 class="my-4 text-center">Veuillez sélectionner une date</h3>

        <hr>
        <div class="text-center">
          <div class="d-flex justify-content-center align-items-center">
            <label for="start">Date de l'épreuve:</label>
            <input v-model="this.date" @input="getSallesByDate()" type="date" id="start" name="trip-start" class="ms-2">
            <div v-if="this.loading" class="spinner-border text-success ms-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p v-if="this.examensSallesByDate.length === 0 && this.date != '' && this.loading != true" value='' class="mb-0 ms-3 error">Pas d'épreuves à cette date</p>
          </div>
        </div>
        <hr>

        <div class="text-center">
          <label for="salles">Choisir une salle:</label>
          <select name="salles" id="salles" class="ms-2">
            <option v-for="salle in this.examensSallesByDate" value='{{ salle.salle.id }}'>{{ salle.salle.nom }}</option>
          </select>
        </div> 
        <hr>

        <div class="text-center">
          <label for="salles">Choisir une formation:</label>
          <select name="salles" id="salles" class="ms-2">
            <option v-for="salle in this.examensSallesByDate" value='{{ salle.salle.id }}'>{{ salle.salle.nom }}</option>
          </select>
        </div> 
        <hr>

        <div class="text-center">
          <label for="salles">Choisir une épreuve:</label>
          <select name="salles" id="salles" class="ms-2">
            <option v-for="salle in this.examensSallesByDate" value='{{ salle.salle.id }}'>{{ salle.salle.nom }}</option>
          </select>
        </div> 
        <hr>

        <div class="text-center pt-3">
          <button type="button" class="btn btn-primary" :disabled="this.disabled">Afficher cartouche</button>
        </div>
        
    </div>
    

      <FooterBase></FooterBase>
  </main>
</template>

<style>
.error{
  color: red;
  font-weight: 600;
}
</style>
