<template>
	<div
		class="full-height"
	>
		<div
			v-if="!is_pw"
			class="flex-column full-height">
			<div class="pa-20 flex-column full-height overflow-y-auto" ><div>
				<h6>아이디</h6>
					<input
						v-model="item.member_id"
						type="text" placeholder="아이디를 입력하세요"
						class="input-underline"
						maxlength="20"
					/>
				</div>
				<div class="mt-10">
					<h6>이름</h6>
					<input
						v-model="item.member_name"
						type="text" placeholder="이름을 입력하세요"
						class="input-underline"
						maxlength="20"
					/>
				</div>
				<div
					class="mt-10"
				>
					<h6>연락처</h6>
					<input
						v-model="item.member_phone"
						type="number" placeholder="연락처를 입력하세요"
						class="input-underline"
						:rules="[rules.max(item, 'member_phone', 15)]"
					/>
				</div>
			</div>
			<div
				class="bottom"
			>
				<button
					@click="findId"
					class="btn btn-identify"
				>비밀번호 찾기</button>
			</div>
		</div>

		<Password
			v-if="is_pw"
			:Axios='Axios'
			:member_info='item'
			:rules='rules'
			:type='type'

			@setNotify="setNotify"
		></Password>

	</div>
</template>

<script>

import Password from "@/view/Account/Password";
export default{
	name: 'FindPw'
	,props: ['Axios', 'rules']
	,components: {Password }
	,data: function(){
		return {
			program: {
				name: '비밀번호 찾기'
				,title: true
				,callBack: {
					name: 'finish'
					,event: 'finish'
				}
			}
			,type: 'find'
			,member_id: ''
			,item: {
				member_name : ''
				,member_phone : ''
			}
			,is_pw: false
		}
	}
	,computed: {
		search_id: function(){
			let id = ''
			if(this.member_id){
				let length = this.member_id.length
				let start = Math.ceil(length / 3)
				let end = Math.floor(length / 3)
				console.log('length : ' + length + ' start: ' + start + ' end: ' + end)
				id = this.member_id.slice(0, start)
					+ this.member_id.slice(start, start + end).replace(/(?<=.{0})./gi, "*")
					+ this.member_id.slice(start + end, length)

			}
			return id
		}
	}
	,methods: {
		confirm: function(){

		}
		,findId: async function(){
			try {
				const result = await this.Axios({
					method: 'post'
					, url: 'member/getMemberPw'
					, data: this.item
				})

				if (result.success) {
					this.is_pw = true
				} else {
					this.$bus.$emit('notify', {type: 'error', message: result.message})
				}
			} catch (E) {
				console.log(E)
				this.$bus.$emit('notify', {type: 'error', message: E})
			}
		}
		,toLogin: function(){
			try{

				const NUA = navigator.userAgent.toLowerCase()

				if(NUA.indexOf('android') > -1){
					window.Android.finishFindId()
				}else if(NUA.indexOf('iphone') > -1 || NUA.indexOf('ipad') > -1 || NUA.indexOf('ipod') > -1){
					window.webkit.messageHandlers.callback.postMessage('finishFindId')
				}else{
					document.location.href = '/Login'
				}
			}catch(e){
				document.location.href = '/Login'
			}
		}
		,setNotify: function( {type, message}){
			this.$bus.$emit('notify', { type: type, message: message })
		}

	}
	,created: function(){
		this.$emit('onLoad', this.program)
	}
}
</script>

<style>

</style>