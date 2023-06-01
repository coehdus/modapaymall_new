
import axios from 'axios'
export const common = {

    isMobile: function(){
        let user = navigator.userAgent;
        let w_type = false
        if(user.toLowerCase().indexOf('iphone') > -1 || user.toLowerCase().indexOf('ipad') > -1 || user.toLowerCase().indexOf('ipod') > -1 || user.toLowerCase().indexOf('android') > -1){
            w_type = true
        }

        // console.log('isMobile', w_type)
        return w_type
    }
    , getIp: async function(){
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            if(response){
                return response.data.ip
            }else{
                throw 'error'
            }
        } catch (error) {
            console.error(error);
        }
    }
}