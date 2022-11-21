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
					@click="postLogin"
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

					if(result.success){
						this.member_info = result.data.member_info
						this.shop_info = result.data.shop_info
						this.seller_info = result.data.seller_info
					}else{
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