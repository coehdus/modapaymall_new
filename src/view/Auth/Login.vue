<template>
	<div
		class="bg-login flex-column justify-center full-height"
	>
		<div
			class="bg-login-content pa-10"
		>
			<div
				class="pa-10 text-center"
			>
				<div
					v-if="$production"
					class="mt-20 mb-30 size-px-24 font-weight-bold vertical-middle"
				><img :src="$shop_logo" style="width: 50%"></div>
				<div
					v-else
					class="bg-base color-white pa-10 "
				>{{ $production_title }}</div>
			</div>
			<div class="pa-10">
				<input
					v-model="item.member_id"
					class="input-underline"
					:class="{  input: isIdInput, 'error-underline': error.type == 'id' }"
					type="text" placeholder="아이디를 입력하세요."
					maxlength="15"
					@keyup.enter="login"
				/>
			</div>
			<div class="pa-10 toggle-password">
				<input
					v-model="item.member_pw"
					class="input-underline"
					:class="{ input: isPwInput, 'error-underline': error.type == 'pw'  }"
					:type="toggleType"
					placeholder="비밀번호를 입력하세요."
					maxlength="50"
					@keyup.enter="login"
				/>
				<v-icon
					v-if="toggleType == 'text'"
					class="toggle"
					:class="{ on: toggleType == 'text' }"
					@click="toggles_on_pw"
				>mdi-eye</v-icon>
				<v-icon
					v-else
					class="toggle"
					:class="{ on: toggleType == 'text' }"
					@click="toggles_on_pw"
				>mdi-eye-off</v-icon>
			</div>
			<div
				v-show="error.type"
				class="pa-10 color-red"
			><v-icon small class="color-red">mdi-alert</v-icon> {{ error.msg }}</div>
			<div class="pa-10">
				<label
				>
					<input
						v-model="is_auto_login"
						type="checkbox"
						class="login-checkbox"
					/> <span class="auto-login">자동 로그인</span>
				</label>
			</div>

			<div
				class="mt-10"
			>
				<button
					class="btn btn-identify"
					@click="login"
				>로그인</button>
			</div>

			<div
				class="pa-10 mt-10 text-center login-menu justify-space-around"
			>
				<router-link
					v-if="false"
					:to="{ name: 'Join' }"
				>가입하기</router-link>

				<router-link :to="{ name: 'FindId' }">아이디 찾기</router-link>
				<router-link :to="{ name: 'FindPw' }">비밀번호 찾기</router-link>
			</div>

		</div>
	</div>
</template>

<script>

import { Base64 } from 'js-base64'

export default{
	name: 'Login'
	,props: ['Axios', 'codes']
	,data: function() {
		return {
			program: {
				name: '로그인'
				, code: 'login'
				, top: false
				, bottom: false
				, title: false
				, bland: false
				, wrap: 'loginNew'
			}
			,title: process.env.VUE_APP_TITLE_DEV
			,item: {
				member_id: ''
				,member_pw: ''
			}
			,is_id_save: false
			,is_auto_login: false
			,error: {
				type: ''
				,msg: ''
			}
			,is_id_error: false
			,is_pw_error: false
			,is_on_pw: false
		}
	}
	,computed: {
		isIdInput: function(){
			if(this.item.member_id){
				return true
			}else{
				return false
			}
		}
		, isPwInput: function(){
			if(this.item.member_pw){
				return true
			}else{
				return false
			}
		}
		,toggleType: function(){
			if(this.is_on_pw){
				return 'text'
			}else{
				return 'password'
			}
		}
	}
	,methods: {
		login: async function(){
			let item = this.item
			try {
				let result = await this.Axios({
					method: 'post'
					, url: '/memberProcess/login'
					, data: item
				})

				if (result.success) {

					sessionStorage.setItem(process.env.VUE_APP_NAME + 'T', Base64.encode(this.item.member_id))
					sessionStorage.setItem(process.env.VUE_APP_NAME + 'T2', Base64.encode(this.item.member_pw))

					if (this.is_id_save) {
						localStorage.setItem(process.env.VUE_APP_NAME + 'S', Base64.encode(this.item.member_id))
					} else {
						localStorage.removeItem(process.env.VUE_APP_NAME + 'S')
						//localStorage.removeItem('is_id_save')
					}
					if (this.is_auto_login) {
						localStorage.setItem(process.env.VUE_APP_NAME + 'A', true)
						localStorage.setItem(process.env.VUE_APP_NAME + 'N', Base64.encode(Base64.encode(this.item.member_id)))
						localStorage.setItem(process.env.VUE_APP_NAME + 'P', Base64.encode(Base64.encode(this.item.member_pw)))
					} else {
						localStorage.removeItem(process.env.VUE_APP_NAME + 'A')
						if(!this.is_id_save) {
							localStorage.removeItem(process.env.VUE_APP_NAME + 'N')
						}
						localStorage.removeItem(process.env.VUE_APP_NAME + 'P')
					}
					this.toMain()
					this.error.type = ''
				} else {

					if(result.message.indexOf('아이디') > -1){
						this.error.type = 'id'
					}else{
						this.error.type = 'pw'
					}
					this.error.msg = result.message
				}
			} catch (e) {
				this.$bus.$emit('notify', {type: 'error', message: e})
			}
		}
		,toggles_on_pw: function(){
			if(this.is_on_pw){
				this.is_on_pw = false
			}else{
				this.is_on_pw = true
			}
		}
		,toMain: function(){
			document.location.href = '/Index'
		}
	}
	,mounted() {
		if(localStorage.getItem(process.env.VUE_APP_NAME + 'S')){
			this.is_id_save = Base64.decode(localStorage.getItem(process.env.VUE_APP_NAME + 'S'))
			this.item.member_id = Base64.decode(localStorage.getItem(process.env.VUE_APP_NAME + 'S'))
		}

		if(localStorage.getItem(process.env.VUE_APP_NAME + 'A')){
			this.is_auto_login = Base64.decode(localStorage.getItem(process.env.VUE_APP_NAME + 'A'))
			this.item.member_id = Base64.decode(Base64.decode(localStorage.getItem(process.env.VUE_APP_NAME + 'N')))
			this.item.member_pw = Base64.decode(Base64.decode(localStorage.getItem(process.env.VUE_APP_NAME + 'P')))
			this.login()
		}
	}
	,created: function(){
		this.$emit('onLoad', this.program)

	}
	,watch: {

	}
}
</script>

<style>
.bg-login { background-color: #eee; padding: 10px;}
.bg-login-content { background-color: white; border-radius: 5px}

.auto-login { vertical-align: middle; font-size: 14px; }

.login-menu { }
.login-menu a { font-size: 14px; font-weight: 400}

.toggle-password { position: relative; }
.toggle-password .toggle { position: absolute; right: 10px; top: 20px; color: #bbb}
.toggle-password .toggle.on { color: #0f6ecd}

.error-underline { background: none; border-bottom: 1px solid red !important;}

</style>