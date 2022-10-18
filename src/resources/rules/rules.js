

export const rules = {
	max: (obj, part, max) => {
		if(obj[part]){
			obj[part] = obj[part].substring(0, max)
			return ''
		}else{
			return ''
		}
	}
	,numeric: (obj, part, max) => {
		
		if(obj[part]){
			const num = obj[part].search(/[0-9]/g);
			if(num){
				this.$set(obj, part, max)
			}
		}
	}
	,id: (obj, part, {min, max}) => {
		if(obj[part]){
			console.log(obj[part])
			if(obj[part].length < min){
				return { result: false, type: 'min'}
			}
			if(obj[part].length > max){
				return { result: false, type: 'max'}
			}

			obj[part] = obj[part].replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, '')
			//return { result: false, type: 'kor'}

			const num = obj[part].search(/[^0-9]/g)
			if(!num){
				return { result: false, type: 'num'}
			}
		}
	}
	,demical: (obj, part, {min, max}) => {
		if(obj[part]){
			const temp = obj[part].split('.')
			const num = Array.isArray(temp) ? temp[0] : temp
			const dem = temp[1]
			
			if(num.length > min){
				if(dem){
					obj[part] = num.substring(0, min) + '.' + dem
				}else{
					obj[part] = num.substring(0, min)
				}
			}
			
			if(dem){
				if(dem.length > max){
					obj[part] = num + '.' + dem.substring(0, max)
				}
			}
			
			return ''
		}
	}
	,email: (obj, part) => {
	
		if(obj[part]){

			const pattern = /[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i
			
			if(pattern.test(obj[part])){
				return true
			}else{
				return false
			}
		}else{
			return false
		}
	}
	
	,password: (obj, part) => {
	
		if(obj[part]){
		
			const min = 8
			const max = 40
			let value = obj[part]
			const num = value.search(/[0-9]/g);
			const high = value.search(/[A-Z]/ig);
			const low = value.search(/[a-z]/ig);
			const spe = value.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
			
			if(value.length < min){
				return '영문 대소문자 + 숫자 + 특수문자 조합 8~40자리'
			}
			if(value.length > max){
				return '영문 대소문자 + 숫자 + 특수문자 조합 40자리 이하'
			}
			if(num < 0){
				return '영문 대소문자 + 숫자 + 특수문자 조합 필요'
			}
			if(high < 0){
				return '영문 대문자 + 특수문자 조합 필요'
			}
			if(low < 0){
				return '영문 소문자 + 특수문자 조합 필요'
			}
			if(spe < 0){
				return '특수문자 조합 필요'
			}
			
			if(value.length < min || value.length > max || num < 0 || high < 0 || low < 0 || spe < 0){
				return '영문 대소문자 + 숫자 + 특수문자 조합 8~40자리'
			}else{
				return true
			}
		}
	}
}