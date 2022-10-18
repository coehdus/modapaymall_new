<template>
	<div
		class="flex-column full-height"
	>
		<div class="pa-20 flex-column full-height overflow-y-auto" >
			<div>
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
			>아이디 찾기</button>
		</div>


		<Modal
			:option="modal_option"
			:is_modal="is_modal"

			@close="is_modal = !is_modal"
		>
			<div
				slot="modal-content"
				class="flex-column justify-center full-height"
			>
				<div
					class="text-center"
				>
					<p class="mt-10">가입하신 아이디는 아래와 같습니다.</p>
					<p class="mt-10">{{ search_id }}</p>
				</div>
			</div>

			<div slot="modal-bottom">
				<button
					class="btn btn-blue"

					@click="toLogin"
				>확인</button>
			</div>

		</Modal>

	</div>
</template>

<script>

import Modal from "@/components/Modal";

export default{
	name: 'FindId'
	,props: ['Axios', 'rules']
	,components: { Modal }
	,data: function(){
		return {
			program: {
				name: '아이디 찾기'
				,title: true
				,callBack: {
					name: 'finish'
					,event: 'finish'
				}
			}
			,member_id: ''
			,item: {
				member_name : ''
				,member_phone : ''
			}
			,is_modal: false
			,modal_option: {
				top: true
				,title: '아이디 찾기 안내'
				,bottom: true
			}
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
					, url: 'member/getMemberId'
					, data: this.item
				})

				if (result.success) {
					this.member_id = result.data.member_id
					this.is_modal = true
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

	}
	,created: function(){
		this.$emit('onLoad', this.program)
	}
}
</script>

<style>

</style>