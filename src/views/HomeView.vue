<script>
import { defineComponent } from 'vue'
import axios from "axios";
import FooterBase from '@/components/FooterBase.vue';
import Header from "@/components/Header.vue";
export default ({
    name: "HomeView",
    components: {
      FooterBase, Header
    },
    data(){
      return {
        apiUrl: '',
        date: '',
        salle: '',
        formation: '',
        epreuve: '',

        cartouche: [],

        disabled: true,
        loading: false,
        toCartoucheClicked: false,

        sallesByDate : [],
        formationsByDate : [],
        epreuvesByDate : []
      }
    },
    methods: {
      isDisabeld(){
        if(this.date === "" || this.sallesByDate.length === 0 || this.salle === '' || this.formation === '' || this.epreuve === ''){
          this.disabled = true;
        }
        else{
          this.disabled = false;
        }
      },
      callApi(){
        this.getSallesByDate()
        this.getFormationsByDate()
        this.getEpreuvesByDate()
      },
      getSallesByDate(){
        this.loading = true;
        axios.get(this.apiUrl + "salles/date/" + this.date)
          .then((response) => {
            this.loading = false;
            this.sallesByDate = response.data;})
          .catch((error) => {console.log("Erreur: ", error)})
      },
      getFormationsByDate(){
        this.loading = true;
        axios.get(this.apiUrl + "formations/date/" + this.date)
          .then((response) => {
            this.loading = false;
            this.formationsByDate = response.data;})
          .catch((error) => {console.log("Erreur: ", error)})
      },
      getEpreuvesByDate(){
        this.loading = true;
        axios.get(this.apiUrl + "epreuves/date/" + this.date)
          .then((response) => {
            this.loading = false;
            this.epreuvesByDate = response.data;})
          .catch((error) => {console.log("Erreur: ", error)})
      },
      toCartouche(){
        this.toCartoucheClicked = true;
        axios.get(this.apiUrl + "examen/" + this.date + "/" + this.salle + "/" + this.formation + "/" + this.epreuve)
          .then((response) => {
            this.loading = false;
            this.cartouche = response.data;
              this.$router.push({ name: 'cartouche', params: { id: this.cartouche.id } });
            })
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
  <Header></Header>
  <main>
    <div class="w-75 m-auto">
        <h3 class="my-4 text-center">Veuillez sélectionner une date</h3>

        <hr>

        <div class="text-center">
          <div class="d-flex justify-content-center align-items-center">
            <label for="start">Date de l'épreuve:</label>
            <input v-model="this.date" @input="callApi()" type="date" id="start" name="trip-start" class="ms-2">
            <div v-if="this.loading" class="spinner-border text-primary ms-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p v-if="this.sallesByDate.length === 0 && this.date != '' && this.loading != true" class="mb-0 ms-3 error">Pas d'épreuves à cette date</p>
          </div>
        </div>

        <hr>

        <div class="text-center">
          <label for="salles">Choisir une salle:</label>
          <select v-model="this.salle" name="salles" class="ms-2">
            <option disabled hidden value="">Pas de salle choisie</option>
            <option v-for="salle in this.sallesByDate" :value="salle.id">{{ salle.nom }}</option>
          </select>
        </div>

        <hr>

        <div class="text-center">
          <label for="salles">Choisir une formation:</label>
          <select v-model="this.formation" name="formations" class="ms-2">
            <option disabled hidden value="">Pas de formation choisie</option>
            <option v-for="formation in this.formationsByDate" :value="formation.id">{{ formation.nom }}</option>
          </select>
        </div> 
        <hr>

        <div class="text-center">
          <label for="salles">Choisir une épreuve:</label>
          <select v-model="this.epreuve" name="salles" class="ms-2">
            <option disabled hidden value="">Pas d'épreuve choisie</option>
            <option v-for="epreuve in this.epreuvesByDate" :value="epreuve.id">{{ epreuve.matiere }}</option>
          </select>
        </div> 
        <hr>

        <p v-if="this.cartouche.length === 0 && this.toCartoucheClicked == true" class="mb-0 ms-3 error">Pas de cartouche avec ces paramètres.</p>

        <div class="text-center pt-3">
          <button @click="toCartouche()" type="button" class="btn btn-primary" :disabled="this.disabled">Afficher cartouche</button>
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
