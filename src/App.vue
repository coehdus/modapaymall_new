<template>
	<Layout
		:Axios="Axios"
		:Notify="Notify"
		:filter="filter"
		:date="date"
		:rules="rules"
		:Base64="Base64"
		:metaInfo="metaInfo"
		:TOKEN="TOKEN"
		:member_info="member_info"
		:codes="codes"
	/>
</template>

<script>
	
	import { Axios } from '@/resources/axios/axios'
	import { Notify } from '@/components/AlertMsg'
	import { filter } from '@/resources/filter/filter'
	import { date } from '@/resources/date/date'
	import { rules } from '@/resources/rules/rules'
	import { metaInfo } from '@/resources/config/metainfo'

	import { Base64 } from 'js-base64'

	import Layout from '@/view/Layout/Layout.vue'
	//import {codes} from "@/resources/config/codes";

export default {

	name: 'App'
	,metaInfo: metaInfo
	,components: { Layout }
	,data: () => ({
		Axios: Axios
		,Notify: Notify
		,date: date
		,filter: filter
		,rules: rules
		,Base64: Base64
		,metaInfo: metaInfo
		,TOKEN: ''
		,codes: null
		,member_info: {

		}
	})
	,methods: {
		isAuth: function(){
			console.log('isAuth start !!')
			let TOKEN = sessionStorage.getItem('delimallT')
			let skip = false
			let except = ['auth']
			let path = document.location.href
			except.forEach(function (val) {
				if (path.toLowerCase().indexOf(val) > -1) {
					skip = true
					return false
				}
			})
			if(skip){
				console.log('isAuth skip ! do next !!')
			}else {
				if (!TOKEN || TOKEN === 'false') {
					console.log('not auth ! to login !!')
					this.toLogin()
				}else{
					this.TOKEN = encodeURI(TOKEN)
					this.getBaseInfo()
					this.getBaseCode()
				}
			}

			console.log('isAuth finished !!')
		}
		,toLogin: function(){
			//this.$router.push({ name: 'Login' })
			document.location.href = '/Auth/Login'
		}
		,getBaseInfo: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'member/getBaseInfo'
					,data: {
						TOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.member_info = result.data.member_info
					this.shop_info = result.data.shop_info
					this.seller_info = result.data.seller_info
				}else{
					console.log(result.message)
				}
			}catch (e) {
				console.log(e)
			}
		}
		,getBaseCode: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'management/getCodeList'
					,data: {
						ATOKEN: this.TOKEN
					}
				})

				if(result.success){
					this.setCode(result.data.result)
				}else{
					this.toLogin()
					console.log(result.message)
				}
			}catch (e) {
				console.log(e)
			}
		}
		,setCode: function(code_list){
			let list = {}
			code_list.forEach(function(code){
				let main = list[code.main_code]
				if(!main){
					code.items = []
					list[code.main_code] = code
				}
				list[code.main_code].items.push(code)
			})

			this.$set(this, 'codes', list)
			console.log(list)
		}
	}
	,created() {
		this.isAuth()
	}
};
</script>
