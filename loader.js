(function(){
    var moduleCache= {};

    var require = function(deps,callback){
        var params = [];
        var depCount = 0;
        var i,
            len,
            isEmpty=false;
        var modName;

        if(deps.length){
            for(i=0,len=deps.length;i<len;i++){
                (function(i){
                    depCount++;
                    loadMod(deps[i],function(param){
                        parmas[i] = param;
                        depCount--;
                        if(depCount ==0){
                            saveModule(modName,params,callback);
                        }
                    })
                })(i);
            }
        }
        else{
            isEmpty = true;
        }
        if(isEmpty){
            setTimeout(function(){
                saveModule(modName,null,callback);
            },0)
        }
    }

    var _getPathUrl = function(modName){
        var url = modName;
        if(url.indexOf('.js')==-1){
            url = url+".js";
        }
        return url;
    }
    var loadMod = function(modName,callback){
        var url = _getPathUrl(modName);
        var fs;
        var mod;

        if(moduleCache[modName]){
            mod = moduleCache[modName];
            if(mod.status ==='loaded'){
                setTimeout(callback(this.params),0);
            }
            else{
                mod.onload.push(callback);
            }
        }
        else{
            mod = moduleCache[modName]={
                modName:modName,
                status:'loading',
                export:null,
                onload:[callback]
            }
            var _script = document.createElement('script');
            _script.id = modName;
            _script.type="text/javascript";
            _script.charset="utf-8";
            _script.async =true;
            _script.src = url;

            fs = document.getElementsByTagName('script')[0];
            fs.parentNode.insertBefore(_script,fs);
        }
    }

    var saveModule = function(modName,params,callback){
        var mod;
        var func;

        if(moduleCacheCache.hasOwnProperty(modName)){
            mod = moduleCache[modName];
            mod.status='loaded';
            mod.export = callback? callback(params):null;

            while(func = mod.onload.shift()){
                func(mod.export);
            }
        }
        else{
            callback&&callback.apply(window,params);
        }
    }

    window.require=require;
    window.define = require;
})();