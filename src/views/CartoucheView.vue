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
        updatingRepere: false,
        updatingCommentaire: false,
        updatingAlerte: false,
        cartouche: [],
        alerts: [],
        pollInterval: null,
        clockInterval:null,
        startHour: null,
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
      updateRepere(updatedRepere){
        this.updatingRepere = true
        axios.put(this.apiUrl + "cartouches/repere/" + this.cartouche.id, {repere: updatedRepere})
          .then((response) => { this.updatingRepere = false})
          .catch((error) => {console.error('Erreur : ', error);})
      },
      updateComment(updatedCommentaire){
        this.updatingCommentaire = true
        axios.put(this.apiUrl + "cartouches/commentaire/" + this.cartouche.id, {commentaire: updatedCommentaire})
          .then((response) => { this.updatingCommentaire = false})
          .catch((error) => {console.error('Erreur : ', error);})
      },
      alertDone(alerteId){
        this.updatingAlerte = true
        axios.put(this.apiUrl + "cartouches/alerte/done/" + alerteId)
          .then((response) => { 
            this.updatingAlerte = false
            this.getAlerts()
          })
          .catch((error) => {console.error('Erreur : ', error);})
      },
      getAlerts(){
        axios.get(this.apiUrl + "cartouches/alertes/" + this.$route.params.id)
          .then((response) => {
            this.alerts = response.data;})
          .catch((error) => {console.log("Erreur: ", error)})
      },
      startClock(){
        if(this.startHour === null){
          this.startHour = new Date()
        }
        const datefin = new Date("2011-10-10T"+this.cartouche.epreuve.duree)
        const sortieAllow = new Date(this.cartouche.epreuve.loge)
        
        let h = this.startHour.getHours(); // 0 - 23
        let m = this.startHour.getMinutes(); // 0 - 59
        
        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        let time = h + ":" + m ;

        document.getElementById("StartTime").textContent = time;
        document.getElementById("EndTime").textContent = (this.startHour.getHours() + datefin.getHours())+ ":" + m ;
        document.getElementById("LeaveTime").textContent = (this.startHour.getHours() + sortieAllow.getHours()) + ":" + m ;
        
        //setTimeout(this.startClock, 1000);
      },
      currentTime(){
        var date = new Date();
        var h = date.getHours(); // 0 - 23
        var m = date.getMinutes(); // 0 - 59
        var s = date.getSeconds(); // 0 - 59
        
        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;
        
        var time = h + ":" + m + ":" + s + " " ;
       
        document.getElementById("CurrentTime").textContent = time;
       
        //setTimeout(this.currentTime, 1000);
      }
    },
    beforeMount() {
      this.apiUrl = import.meta.env.VITE_API_URL
      this.getCartouche()
      
    },
    mounted(){
      this.getAlerts() //recup les alertes dès le chargement de la page

      //Poll get alertes
      this.pollInterval = setInterval(() =>{
        this.getAlerts()
      },10000) //2min
      setTimeout(() => { clearInterval(this.pollInterval) }, 14400000) //arret auto au bout de 4heures

      //Interval de l'horloge
      this.clockInterval = setInterval(() =>{
          this.currentTime()
      },1000)
      setTimeout(() => { clearInterval(this.clockInterval) }, 14400000) //arret auto au bout de 4heures
    },
    unmounted(){
      clearInterval(this.pollInterval)
      clearInterval(this.clockInterval)
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
    <div v-else class="d-flex">
      <div class="display-container d-flex align-items-center flex-column">
        <div class="cartouche-container">
          <div>
            <router-link to="/">
              <button class="btn btn-primary px-4">Retour</button>
            </router-link>
          </div>
          <!-- CARTOUCHE MANUSCRITE -->
          <div v-if="this.cartouche.estdematerialise === 0" class="cartouche-manuscrite">
              <div class="d-flex justify-content-between line mb-3">
                  <div class="d-flex"><label>Académie : </label> <b><p class="ms-2">{{ this.cartouche.formation.academie }}</p></b></div>
                  <div class="d-flex"><label>Session : </label> <b><p class="ms-2">{{ this.cartouche.session }}</p></b></div>
                  <div class="d-flex"><label class="text-muted">Modèle EN. </label> </div>
              </div>
              <div class="d-flex justify-content-between line mb-3">
                  <div class="d-flex"><label>Examen ou Concours : </label> <b><p class="ms-2">{{ this.cartouche.epreuve.examen_concours }}</p></b></div>
                  <div class="d-flex me-4"><label>Série : </label> <b><p class="ms-2">{{ this.cartouche.formation.serie }}</p></b></div>
              </div>
              <div class="d-flex justify-content-between line mb-3">
                  <div class="d-flex"><label>Spécialité/option : </label> <b><p class="ms-2">{{ this.cartouche.formation.serie }}</p></b></div>
                  <div class="d-flex me-4"><label>Repère de l'épreuve : </label> <b><p class="ms-2">{{ this.cartouche.repere }}</p></b></div>
              </div>
              <div class="d-flex justify-content-between line">
                  <div class="d-flex"><label>Épreuve/sous-épreuve : </label> <b><p class="ms-2">{{ this.cartouche.epreuve.epreuve }}</p></b></div>
              </div>
          </div>
          <!-- CARTOUCHE DEMATERIALISE -->
          <div v-else class="cartouche-dematerialise">
              <div class="d-flex justify-content-between mb-1 flex-grow-1">
                    <div class="d-flex w-100"><label>Concours&nbsp;/&nbsp;Examen&nbsp;: </label><p class="mx-2 w-100 dotted">{{ this.cartouche.epreuve.examen_concours }}</p></div>
                    <div class="d-flex me-4"><label>Section&nbsp;/&nbsp;Specialite&nbsp;/&nbsp;Série&nbsp;: </label><p class="ms-2 dotted pe-4">{{ this.cartouche.formation.serie }}</p></div>
              </div>
              <div class="d-flex justify-content-between mb-1 flex-grow-1">
                    <div class="d-flex w-75"><label>Epreuve&nbsp;: </label><p class="mx-2 w-100 dotted">{{ this.cartouche.epreuve.epreuve }}</p></div>
                    <div class="d-flex me-4 w-25"><label>Matière&nbsp;: </label><p class="ms-2 dotted w-100 pe-4">{{ this.cartouche.epreuve.matiere }}</p></div>
              </div>
              <div class="d-flex justify-content-between mb-1 flex-grow-1">
                    <div class="d-flex w-75"></div>
                    <div class="d-flex me-4 w-25"><label>Session&nbsp;: </label><p class="ms-2 mb-1 dotted w-100 pe-4">{{ this.cartouche.session }}</p></div>
              </div>
          </div>

          <div class="d-flex justify-content-end mb-3 position-relative">
              <label class="me-2 w-25 text-end"><b>Repère de l'épreuve : </b></label>
              <input  @input="updateRepere(this.cartouche.repere)" v-model="this.cartouche.repere" id="repere" class="input w-75" placeholder="À remplir par le surveillant" type="text">
              <p class="position-absolute me-2" v-if="this.updatingRepere">Enregistrement...</p>
          </div>
          
          <div class="d-flex justify-content-end mb-3">
              <label class="me-2 w-25 text-end"><b>Règles : </b></label>
              <p class="input w-75">
                <b class="me-3" v-if="this.cartouche.dictionnaire === 1">Dictionnaire,</b>
                <b class="me-3" v-else="this.cartouche.dictionnaire === 1">Dictionnaire interdit,</b>
                <b class="mx-3" v-if="this.cartouche.calculatrice === 1">Calculatrice autorisée</b>
                <b class="mx-3" v-else="this.cartouche.calculatrice === 1">Calculatrice interdite</b>
              </p>
          </div>

          <div class="position-relative">
            <textarea @input="updateComment(this.cartouche.commentaire)" v-model="this.cartouche.commentaire" class="w-100 bordered p-2" placeholder="Commentaire..." rows="2"></textarea>
            <p class="position-absolute me-3 mt-2 top-0 end-0" v-if="this.updatingCommentaire">Enregistrement...</p>
          </div>
          
        </div>

        <!-- Clock -->
        <div class="clock-container text-center">
          
          <button v-if="this.startHour == null" class="btn btn-primary px-4" type="button" @click="startClock()">Démarrer l'épreuve <i class="bi bi-play-fill"></i></button>
          <form v-if="this.startHour != null" class="d-flex align-items-center justify-content-center">
            <input type="time" class="form-control w-25 " min="00:00" max="24:00" required>
            <button class="btn btn-primary" type="submit">Changer&nbsp;l'heure&nbsp;de&nbsp;début</button> 
          </form>

          <div id="CurrentTime" class="currentClock"></div>

          <div class="d-flex justify-content-between">
              <div class="d-flex justify-content-center mx-2 clock">
                <label for="StartTime">Heure de début :&nbsp;</label>
                <div id="StartTime"></div>
              </div>
              <div class="d-flex justify-content-center mx-2 clock">
                <label for="LeaveTime">Sortie autorisée :&nbsp;</label>
                <div id="LeaveTime"></div>
              </div>
              <div class="d-flex justify-content-center mx-2 clock">
                <label for="EndTime">Heure de fin :&nbsp;</label>
                <div id="EndTime" ></div>
              </div>
          </div>
        </div>
      </div>
      
      <!-- SIDEBAR -->
      <div class="d-flex flex-column flex-shrink-0 p-3 border-start sidebar">
          <h4 class="my-3 text-center">Notifications</h4>
          <hr>
          <div v-if="this.alerts.length != 0">
            <div v-for="alert in this.alerts">
              <div v-if="alert.done == 1" class="border rounded p-3 my-2 past-alert">
                <h4><i class="bi bi-exclamation-triangle-fill"></i> {{alert.titre}}</h4>
                <hr>
                <p>{{alert.description}}</p>
              </div>
            </div>
          </div>
          <div v-else>
            <h4 class="text-muted text-center mt-4">Pas de notifications</h4>
          </div>
      </div>
     
      <!-- DIV ALERTES -->

      <div v-if="this.alerts.length != 0" class="p-4 mt-4 ms-3 position-absolute end-0">
        <div v-for="alert in this.alerts" >
          <div v-if="alert.done == 0" class="alert alert-danger alert-dismissible fade show" role="alert">
            <h2 class="blink"><i class="bi bi-exclamation-triangle-fill"></i> {{alert.titre}}</h2>
            <hr>
            <p>{{alert.description}}</p>
            <button @click="alertDone(alert.id)" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        </div>
      </div>
    </div>
  </main>
  
</template>

<style scoped>
  .sidebar{
    width: 30vw;
    height: 100vh;
    overflow-y: auto;
  }
  .display-container{
    width: 70vw;
    margin: 1rem;
  }
  .cartouche-container{
    width: 92ch;
  }
  .clock-container{
    margin: 1rem;
    margin-top: 1.5rem;
  }
  .alert{
    width: 45ch;
  }
  .dotted{
    border-bottom: 2px dotted black;
    font-weight: bold;
  }
  .cartouche-manuscrite, .cartouche-dematerialise{
    border: 1px solid #ced4da;
    border-radius: .375rem;
    margin: 1rem 0;
    padding: 1rem;
  }
  .bordered{
    border: 1px solid #ced4da;
    border-radius: .375rem;
  }
  .cartouche-manuscrite p {
    margin-bottom: .2rem;
  }
  .line{
    border-bottom: 1px solid black;
  }
  #repere{
    font-weight: 900;
    color: rgb(39, 53, 255);
  }
  .input{
    border: none;
    border-bottom: 1px solid black;
  }
  .past-alert{
    background-color: #f3f3f3;
  }
  .text-muted{
    font-size: small;
  }
  .clock{
    border: 1px solid #ced4da;
    border-radius: .375rem;
    padding: 0.1rem 1rem;
    
  }
  #CurrentTime{
    font-size: 78pt;
    font-weight: bold;
  }

</style>
