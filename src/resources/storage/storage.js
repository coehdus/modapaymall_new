
import { Base64 } from 'js-base64'
import router from '../../router'

export const storage = {
    setQuery: function(data){
        localStorage.setItem(Base64.encode('query'), Base64.encode(JSON.stringify(data)))
    }
    ,getQuery: function(){
        let storage = localStorage.getItem(Base64.decode('query'))
        if(storage){
            return Base64.decode(storage)
        }else{
            return null
        }
    }

    ,push: function({ name, params, query, not_query }){

        router.push({ name: name, params: params, query: query}).catch(function(e){
            console.log(e)
        })
        if(!not_query) {
            localStorage.removeItem(Base64.decode('query'))
        }else{
            this.setQuery()
        }
    }
}