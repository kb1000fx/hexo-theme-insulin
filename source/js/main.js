var app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data(){
    return {
      currentPage: 1,
      nightMode:"wb_sunny",
      hover: false,
    }
  },

  methods:{
    PageChange: function(){
      if(this.currentPage==1){
        window.location.href = location.pathname.split("page/")[0];
      }else{
        window.location.href = location.pathname.split("page/")[0] +'page/' + this.currentPage + "/";
      };
    },
    SetNightMode: function(){
      if (this.$vuetify.theme.dark == true){
        this.$vuetify.theme.dark = false;
        localStorage.removeItem('insulin-dark');
      }else{
        this.$vuetify.theme.dark = true;
        localStorage.setItem('insulin-dark', true);
      }
    },
  },

  created: function(){
    //Init currentPage
    var varpage = location.pathname.split("page/")[1]
    if(varpage){
      this.currentPage = parseInt(varpage);
    };
    //Init NightMode
    if (localStorage.getItem('insulin-dark')=='true'){
      this.$vuetify.theme.dark = true;
    };
  },
})
