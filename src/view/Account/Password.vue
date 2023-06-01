<template>
	<div
		class="flex-column full-height full-height"
	>
		<div class="pa-20 flex-column full-height overflow-y-auto">
			<div
				v-if="item.type == 'account'"
			>
				<h6>현재 비밀번호</h6>
				<input
					v-model="item.old_password"
					type="password" placeholder="현재 비밀번호를 입력하세요."
					maxlength="50"

					class="input-underline"
				/>
			</div>

			<div
				class="mt-10"
			>
				<h6>신규 비밀번호</h6>
				<input
					v-model="item.member_password"
					type="password" placeholder="신규 비밀번호를 입력하세요."
					maxlength="50"
					class="input-underline"
				/>
			</div>

			<div
				class="mt-10"
			>
				<h6>비밀번호 확인</h6>
				<input
					v-model="item.password_confirm"
					type="password" placeholder="비밀번호를 한번 더 입력하세요."
					maxlength="50"
					class="input-underline"
				/>
			</div>
		</div>
		<div
			class="bottom"
		>
			<button
				class="btn btn-identify"
				@click="save"
			>비밀번호 변경</button>
		</div>
	</div>
</template>

<script>

export default{
	name: 'Password'
	,
	components: {},
	props: ['Axios', 'member_info', 'rules', 'type']
	,data: function(){
		return {
			program: {
				name: '비밀번호 변경'
				,top: false
				,title: true
				,bottom: false
				,class: 'blue'
			}
			,item: {
				member_id: this.member_info.member_id
				,old_password: ''
				,member_password: ''
				,password_confirm: ''
				,type: this.type ? this.type : 'account'
			}
			,view: {
				result: false
			}
			,isSave: true
		}
	}
	,methods: {
		save: async function(){

			if(this.item.type == 'account') {
				if (!this.item.old_password) {
					this.$bus.$emit('notify', {type: 'error', message: '현재 비밀번호를 입력해주세요.'})
					return
				}
			}

			if(!this.item.member_password){
				this.$bus.$emit('notify', {type: 'error', message: '신규 비밀번호를 입력해주세요.'})
				return
			}

			if(!this.item.password_confirm){
				this.$bus.$emit('notify', {type: 'error', message: '신규 비밀번호를 한번 더 입력해주세요'})
				return
			}

			if (this.item.member_password != this.item.password_confirm) {
				this.$bus.$emit('notify', {type: 'error', message: '신규 비밀번호가 맞지 않습니다. 정확하게 입력 해주세요.'})
				return
			}

			try{
				const result = await this.Axios({
					method: 'post'
					, url: 'member/postMemberPassword'
					, data: this.item
				})

				if(result.success){
					this.$bus.$emit('notify', { type: 'success', message: '정상적으로 처리되었습니다' })
					this.item.member_password = ''
					this.item.old_password = ''
					this.item.password_confirm = ''

					this.toLogin()
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch(e){
				this.$bus.$emit('notify', { type: 'error', message: e })
			}
		}

		,toLogin: function(){
			if(this.item.type == 'account') {
				this.$emit('click')
			}else{
				try {
					const NUA = navigator.member_infoAgent.toLowerCase()

					if(NUA.indexOf('android') > -1){
						window.Android.finishFindPw()
					}else if(NUA.indexOf('iphone') > -1 || NUA.indexOf('ipad') > -1 || NUA.indexOf('ipod') > -1){
						window.webkit.messageHandlers.callback.postMessage('finishFindPw')
					}else{
						document.location.href = '/Login'
					}
				}catch(e){
					this.$bus.$emit('notify', { type: 'error', message: e})
					document.location.href = '/Login'
				}
			}
		}
	}
	,created: function(){
		this.$emit('onLoad', this.program)
	}
}

</script>

<style>
.content input[type=text] { width: 100%; border-bottom: 1px solid #ddd; padding: 10px 0;}
</style>