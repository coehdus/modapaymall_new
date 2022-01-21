import Vue from 'vue'

Vue.filter("maxLength", (val, max) => {
	if(val){
		if(val.length > max){
			return val.substring(0, max)
		}
	}else{
		return ''
	}
})

Vue.filter("nl2br", (val) => {
	if(val){
		return val.replaceAll('\n', '<br/>')
	}else{
		return ''
	}
})

Vue.filter("makeComma", val => {
	val += ''
	if(!val || val == 'null' || val == undefined){
		return 0
	}else{
		//val = Math.ceil(val)
		return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
})

Vue.filter("makePhoneNumber", val => {
	if(val){
		return val.substring(0, 3) + '-' + val.substring(3, 7) + '-' + val.substring(7, 11)
	}else{
		return ''
	}
})
Vue.filter("makeCardNumber", val => {
	if(val){
		return val.substring(0, 4) + '-' + val.substring(4, 6) + '##-####-' + val.substring(12, 16)
	}else{
		return ''
	}
})

Vue.filter("transDateWeek", val => {
	if(val){
			
		let weeks = ['일', '월', '화', '수', '목', '금', '토']
		let day = new Date(val.substring(0, 4) + '-' + val.substring(4, 6) + '-' + val.substring(6, 8)).getDay()
		let week = weeks[day]
		
		return val.substring(0, 4) + '년' + val.substring(4, 6) + '월' + val.substring(6, 8) + '일(' + week + ')' 
	}else{
		return ''
	}
})
Vue.filter("transDate", val => {
	if(val){
		val = val.replaceAll('-', '')
		return val.substring(0, 4) + '-' + val.substring(4, 6) + '-' + val.substring(6, 8)
	}else{
		return ''
	}
})
Vue.filter("transTime", val => {
	if(val){
		return val.substring(0, 2) + ':' + val.substring(2, 4) + ':' + val.substring(4, 6)
	}else{
		return ''
	}
})
Vue.filter("transWeek", val => {
	let weeks = ['일', '월', '화', '수', '목', '금', '토']
	if(val){
		let date = new Date(val.substring(0, 4) + '-' + val.substring(4, 6) + '-' + val.substring(6, 8))
		
		return weeks[date.getDay()]
	}else{
		return ''
	}
})

Vue.filter('makeTell', val => {
	if(val){
		val = val.replace('-', '')
		return val.substring(0, 3) + '-' + val.substring(val.length-8, val.length-4) + '-' + val.substring(val.length-4, val.length)
	}else{
		return ''
	}
})

Vue.filter('imgUrl', val => {
	if(val){
		val = process.env.VUE_APP_IMG_URL + val
		return val
	}else{
		return ''
	}
})

Vue.filter('takeInitial', val => {
	if(val){
		const kor = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
		let result
		for(let i = 0 ; i < val.length; i++) {
			let utf = val.charCodeAt(i) - 44032;

			if(utf > -1 && utf < 11172) {
				result += kor[Math.floor(utf/588)];
			} else {
				result += val.charAt(i);
			}
			
			return result
		}
	}else{
		return ''
	}
})

export const common = function(){
	
}


