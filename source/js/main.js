var app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data(){
    return {
      currentPage: 1,
      nightMode:"wb_sunny",
      menuHover: false,
      commentTab: 0,
      disqusHTML:'<div id="disqus_thread"></div>',
      gitalkHTML:'<div id="gitalk-container"></div>',
      valineHTML:'<div id="vcomments"></div>',
      gitalkClicked: false,
      livereClicked: false,
      changyanClicked: false,
      disqusClicked: false,
      valineClicked: false,
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
    TabChange: function(){  
      var tabName = document.getElementById("comment-tab-"+this.commentTab).innerHTML;
      if(!eval('this.'+tabName+'Clicked')){
        eval(
          tabName+'();'+
          'this.'+tabName+'Clicked=true;'
        );
      }
    }
  },

  created: function(){
    //初始化currentPage
    var varpage = location.pathname.split("page/")[1];
    if(varpage){
      this.currentPage = parseInt(varpage);
    };
    //初始化NightMode
    if (localStorage.getItem('insulin-dark')=='true'){
      this.$vuetify.theme.dark = true;
    };
  },

  mounted: function () {
    //初始化评论
    if(document.getElementsByClassName("comment-card").length){
      eval(document.getElementsByClassName("active-comment-tab")[0].children[0].innerHTML + '();');
    };
  },
})
