<script>
import { defineComponent } from 'vue'
import axios from "axios";
import FooterBase from '@/components/FooterBase.vue';

export default ({
    name: "CartoucheView",
    components: {
      FooterBase
    },
    data(){
      return {
        apiUrl: '',
        loading: false,
        cartouche: [],
      }
    },
    methods: {
      getCartouche(){
        this.loading = true;
        axios.get(this.apiUrl + "cartouches/" + this.$route.params.id)
          .then((response) => {
            this.loading = false;
            this.cartouche = response.data;})
          .catch((error) => {console.log("Erreur: ", error)})
      },
    },
    beforeMount() {
      this.apiUrl = import.meta.env.VITE_API_URL
      this.getCartouche()
    },
    updated(){

    }
})
</script>

<template>
  <main>
    <div v-if="this.loading && this.cartouche.length === 0" class="vh-100 d-flex justify-content-center align-items-center">
        <div class="spinner-border text-primary ms-3" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div v-else>
      <div class="cartouche-manuscrite">
          <div class="d-flex justify-content-between line mb-3">
            <div class="d-flex"><label>Académie : </label> <b><p class="ms-2">{{ this.cartouche.formation.academie }}</p></b></div>
            <div class="d-flex"><label>Session : </label> <b><p class="ms-2">{{ this.cartouche.formation.academie }}</p></b></div>
            <div class="d-flex"><label class="text-muted">Modèle EN. </label> </div>
          </div>
          <div class="d-flex justify-content-between line mb-3">
            <div class="d-flex"><label>Examen ou Concours : </label> <b><p class="ms-2">{{ this.cartouche.formation.academie }}</p></b></div>
            <div class="d-flex me-4"><label>Série : </label> <b><p class="ms-2">{{ this.cartouche.formation.academie }}</p></b></div>
          </div>
          <div class="d-flex justify-content-between line mb-3">
            <div class="d-flex"><label>Spécialité/option : </label> <b><p class="ms-2">{{ this.cartouche.formation.academie }}</p></b></div>
            <div class="d-flex me-4"><label>Repère de l'épreuve : </label> <b><p class="ms-2">{{ this.cartouche.formation.academie }}</p></b></div>
          </div>
          <div class="d-flex justify-content-between line">
            <div class="d-flex"><label>Épreuve/sous-épreuve : </label> <b><p class="ms-2">{{ this.cartouche.formation.academie }}</p></b></div>
          </div>
      </div>

    </div>
  </main>
  
</template>

<style scoped>
  .cartouche-manuscrite{
    border: 1px solid rgb(198, 198, 198);
    margin: 2rem;
    padding: 1rem;
  }
  .cartouche-manuscrite p {
    margin-bottom: .2rem;
  }
  .line{
    border-bottom: 1px solid black;
  }

</style>
