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
            commentConfig: null,
            commentFunction: {       
                gitalk: ()=>{
                    var gitalk = new Gitalk({
                        clientID: this.commentConfig.gitalk_client_id,
                        clientSecret: this.commentConfig.gitalk_client_secret,
                        repo: this.commentConfig.gitalk_repo,
                        owner: this.commentConfig.gitalk_owner,
                        admin: [this.commentConfig.gitalk_owner],
                        id:  md5(location.pathname) ,
                        distractionFreeMode: this.commentConfig.gitalk_distractionFreeMode,
                    });
                    gitalk.render('gitalk-container');
                },
                valine: ()=>{
                    var option = {
                        el: '#vcomments',
                        appId: this.commentConfig.valine_leancloud_app_id,
                        appKey: this.commentConfig.valine_leancloud_app_key,
                    };
                    new Valine(Object.assign(option, this.commentConfig.valine_option));
                },
                changyan: ()=>{
                    (function(){
                        var appid = this.commentConfig.changyan_app_id;
                        var conf = this.commentConfig.changyan_app_key;
                        var width = window.innerWidth || document.documentElement.clientWidth;
                        if (width < 960) {
                            window.document.write('<script id="changyan_mobile_js" charset="utf-8" type="text/javascript" src="http://changyan.sohu.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + appid + '&conf=' + conf + '"><\/script>'); } else { var loadJs=function(d,a){var c=document.getElementsByTagName("head")[0]||document.head||document.documentElement;var b=document.createElement("script");b.setAttribute("type","text/javascript");b.setAttribute("charset","UTF-8");b.setAttribute("src",d);if(typeof a==="function"){if(window.attachEvent){b.onreadystatechange=function(){var e=b.readyState;if(e==="loaded"||e==="complete"){b.onreadystatechange=null;a()}}}else{b.onload=a}}c.appendChild(b)};loadJs("http://changyan.sohu.com/upload/changyan.js",function(){window.changyan.api.config({appid:appid,conf:conf})}); 
                        } 
                    })(); 
                },
                disqus: ()=>{
                    (function () {
                        var d = document, s = d.createElement('script');
                        s.src = '//'+this.commentConfig.disqus_shortname+'.disqus.com/embed.js';
                        s.setAttribute('data-timestamp', +new Date());
                        (d.head || d.body).appendChild(s);
                    })();
                },
                livere: ()=>{
                    (function (d, s) {
                        var j, e = d.getElementsByTagName(s)[0];
                        if (typeof LivereTower === 'function') { return; }
                        j = d.createElement(s);
                        j.src = 'https://cdn-city.livere.com/js/embed.dist.js';
                        j.async = true;
                        e.parentNode.insertBefore(j, e);
                    })(document, 'script');
                },
            },
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
        ((varpage)=>{
            if(varpage){
                this.currentPage = parseInt(varpage);
            };
        })(location.pathname.split("page/")[1]);
        //初始化NightMode
        ((isDark)=>{
            if(isDark){
                this.$vuetify.theme.dark = true;
                this.nightMode = "brightness_2";
            }
        })(localStorage.getItem('insulin-dark'));
        //搜索
        ((path)=>{
            if(path=='/search/'){
                axios({
                    methods:"GET",
                    url: "/search.xml",
                    responseType: 'document',
                }).then(res=>{
                    var xmlDoc = res.data.getElementsByTagName("entry");
                    //初始化搜索
                    for (const post of xmlDoc) {
                        this.searchData.push({
                        title: post.getElementsByTagName("title")[0].childNodes[0].nodeValue,
                        content: post.getElementsByTagName("content")[0].childNodes[0].nodeValue,
                        url: post.getElementsByTagName("url")[0].childNodes[0].nodeValue,
                        });
                    }
                    //搜索
                    this.searchPageValue=decodeURI(location.search.substr(1));
                    this.Search(this.searchPageValue); 
                }).catch(error=>{
                    console.error(error);
                });
            }
        })(location.pathname);
        //初始化评论设置
        ((el)=>{
            if(el){
                this.commentConfig = JSON.parse(Base64.decode(el.getAttribute("data")));
                for (let e in this.commentConfig.use) {
                    eval('this.commentFunction.' + this.commentConfig.use[e] + '();');
                }
            }
        })(document.getElementById('tabs-content'));
        //Google Adsense
        (()=>{
            for (let index = 0; index < document.getElementsByClassName('adsense-contain').length; index++) {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }
        })();
    },
})
