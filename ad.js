(function(){
    function appendScript() {
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        document.body.appendChild(script);
    };
    
    function main(hook) {
        if (!$docsify.ga) {
          console.error('[Docsify] ga is required.');
          return;
        }
    
        hook.beforeEach(collect);
    };
    
    $docsify.plugins = [].concat(main, $docsify.plugins);
})();