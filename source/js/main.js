var app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data(){
    return {
      currentPage: 1,
      nightMode: "wb_sunny",
      menuHover: false,
      tagHover: false,
      commentTab: 0,
      disqusHTML:'<div id="disqus_thread"></div>',
      gitalkHTML:'<div id="gitalk-container"></div>',
      valineHTML:'<div id="vcomments"></div>',
      gitalkClicked: false,
      livereClicked: false,
      changyanClicked: false,
      disqusClicked: false,
      valineClicked: false,
      searchHeaderValue: null,
      searchPageValue: null,
      searchData: new Array(),
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
        this.nightMode = "wb_sunny";
      }else{
        this.$vuetify.theme.dark = true;
        localStorage.setItem('insulin-dark', true);
        this.nightMode = "brightness_2";
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
    },
    EnterSearch: function(varSearch,isLocal){
      if(isLocal){
        window.location.href = "/search/?" + encodeURI(varSearch); 
      } else {
        window.location.href = "https://www.google.com/search?q=" + encodeURI(varSearch) + " site:" + window.location.hostname;
      };
    },   
    Search: function(varStr){
      keywords=varStr.split(/\s+/);
      var str="";
      for (const data of this.searchData) {
        var data_title = data.title;
        var data_url = data.url;
        var data_content = data.content.trim().replace(/<[^>]+>/g, '').toLowerCase();
        var index_content = -1;
        if (data_content !== '') {
          for (const keyword of keywords) {
            if(index_content==-1){
              index_content = data_content.indexOf(keyword);
            }
          };
        };
        if(index_content!=-1){
          var start = index_content - 20;
          var end = index_content + 80;
          if(start < 0){start = 0;};
          if(end > data_content.length){end = data_content.length;};
          str += "<div class='search-post'><a class='search-post-title' href='" + data_url + "'>" + data_title + "</a><p class='search-post-content'>" + data_content.substr(start,end) + "</p><hr></div>";
        };
      };
      for (const keyword of keywords) {
        str=str.replace(eval('/'+keyword+'/g'),"<span class='search-post-bold'>" + keyword + "</span>")
      };
      if(str.length==0){
        str="<div class='search-post'>暂无</div>";
      };
      document.getElementById("search-result").innerHTML=str;
    },
  },

  mounted: function () {
    //初始化currentPage
    var varpage = location.pathname.split("page/")[1];
    if(varpage){
      this.currentPage = parseInt(varpage);
    };
    //初始化评论
    if(document.getElementsByClassName("comment-card").length){
      eval(document.getElementsByClassName("active-comment-tab")[0].children[0].innerHTML + '();');
    };
    //初始化NightMode
    if (localStorage.getItem('insulin-dark')=='true'){
      this.$vuetify.theme.dark = true;
      this.nightMode = "brightness_2";
    };
    //初始化搜索
    var xmlHttp=new XMLHttpRequest();
    xmlHttp.open("GET",'/search.xml',false);
    xmlHttp.send();
    var xmlResource=xmlHttp.responseXML.getElementsByTagName("entry");
    for (const post of xmlResource) {
      this.searchData.push({
        title: post.getElementsByTagName("title")[0].childNodes[0].nodeValue,
        content: post.getElementsByTagName("content")[0].childNodes[0].nodeValue,
        url: post.getElementsByTagName("url")[0].childNodes[0].nodeValue,
      });
    }
    //搜索
    if(location.pathname=='/search/'){
      this.searchPageValue=decodeURI(location.search.substr(1));
      this.Search(this.searchPageValue);
    };
  },
})
