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
				><img src="@/assets/images/delimall/logo.png" style="width: 50%"></div>
				<div
					v-else
					class="bg-base color-white pa-10 "
				>{{ $production_title }}</div>
			</div>
			<div class="pa-10">
			</div>
			<div class="pa-10 toggle-password">
			</div>
			<div
				v-show="error.type"
				class="pa-10 color-red"
			><v-icon small class="color-red">mdi-alert</v-icon> {{ error.msg }}</div>
			<div class="pa-10">
			</div>

			<div
				class="mt-10"
			>
			</div>

			<div
				class="pa-10 mt-10 text-center login-menu justify-space-around"
			>
			</div>

		</div>
	</div>
</template>

<script>
	import {Base64} from "js-base64";

	export default {
		name: 'ShopLogin'
		, props: ['Axios']
		, data: function(){
			return {
				shop_id: this.$route.params.shop_id
				, item: {
					member_id: ''
					, member_pw: ''
				}
				,error: {
					type: ''
					,msg: ''
				}
				,is_id_error: false
				,is_pw_error: false
				,is_on_pw: false
			}
		}
		, computed: {
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
		, methods: {
			postLogin: async function(){
				try {
					this.$bus.$emit('on', true)
					const result = await this.Axios({
						method: 'post'
						,url: 'memberProcess/postShopLogin'
						,data: {
							shop_id: this.shop_id
						}
					})

					if (result.success) {

						sessionStorage.setItem(process.env.VUE_APP_NAME + 'T', Base64.encode(this.item.member_id))

						localStorage.removeItem(process.env.VUE_APP_NAME + 'S')
						localStorage.removeItem(process.env.VUE_APP_NAME + 'A')
						localStorage.removeItem(process.env.VUE_APP_NAME + 'N')
						localStorage.removeItem(process.env.VUE_APP_NAME + 'P')

						this.toMain()
						this.error.type = ''
					} else {
						throw result.message
					}
				}catch (e) {
					console.log(e)
					this.$bus.$emit('notify', { type: 'error', message: e})
				}finally {
					this.$bus.$emit('on', false)
				}
			}
		}
		, created() {
			this.postLogin()
		}
	}
</script>