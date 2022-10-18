<template>
	<div
		class="flex-column full-height"
	>
		<div
			class="bg-title"
		>
			<button
				:title="program.name"
				@click="toBack()"
			><v-icon large class="">mdi-chevron-left</v-icon><span class=" font-weight-bold size-em-15 vertical-middle">{{ program.name }}</span></button>
		</div>

		<div
			class="pa-20 flex-column full-height overflow-y-auto"
		>
			<div
				class="mt-10"
			>
				<h6>대리점 코드</h6>
				<input
					v-model="item.admin_code"
					type="text"
					class="mt-10 pa-10 input-underline"
					placeholder="대리점 코드를 입력하세요"
					:disabled="isGetAdminCode"
				/>
			</div>
			<div
				class="mt-10"
			>
				<h6>아이디</h6>
				<input
					v-model="item.member_id"
					type="text" placeholder="아이디를 입력하세요"
					class="mt-10 pa-10 input-underline"
					:disabled="isCheckId"
					:rules="[rules.id(item, 'member_id', { min: 6, max: 25})]"
				/>
			</div>

			<div
				class="mt-10"
			>
				<h6>비밀번호</h6>
				<input
					v-model="item.member_password"
					type="password" placeholder="영문/숫자/특수문자 포함 8~20자리"
					class="pa-10 input-underline"
					maxlength="50"
				/>
				<div
					v-if="this.txtValidCheckPass != ''"

					class="mt-10 text-right color-red"
				>{{ this.txtValidCheckPass }}</div>
			</div>

			<div
				class="mt-10"
			>
				<h6>비밀번호 확인</h6>
				<input
					v-model="item.member_password_confirm"
					type="password" placeholder="비밀번호를 한번 더 입력하세요"
					class="pa-10 input-underline"
					maxlength="50"
				/>
				<div
					v-if="item.member_password_confirm && item.member_password && (item.member_password_confirm != item.member_password)"

					class="mt-10 text-right color-red"
				>비밀번호를 확인하세요</div>
			</div>

			<div
				class=" mt-10"
			>
				<h6>이름</h6>
				<input
					v-model="item.member_name"
					type="text" placeholder="이름을 입력하세요"
					class="pa-10 input-underline"
					maxlength="10"
				/>
			</div>

			<div
				v-if="false"
				class="mt-10"
			>
				<h6>주소</h6>
				<div
					class="mt-10 flex-row"
				>
					<input
						v-model="item.member_post"
						type="number" placeholder="우편번호"
						class="input-box flex-2"
						readonly

						:rules="[rules.numeric(item, 'member_post', 10)]"
					/>
					<button
						class="btn btn-blue flex-1"
						@click="daumPost('default')"
					>주소 검색</button>
				</div>
				<div
					class="mt-10"
				>
					<input
						v-model="item.member_addr1"
						type="text" placeholder="기본 주소"
						class="input-box"
						readonly
						maxlength="80"
					/>
				</div>
				<div
					class="mt-10"
				>
					<input
						v-model="item.member_addr2"
						type="text" placeholder="상세 주소를 입력하세요"
						class="input-box"
						maxlength="50"
					/>

				</div>
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

			<div
				class="mt-10"
			>
				<h6>이메일</h6>
				<input
					v-model="item.member_email"
					type="text" placeholder="이메일을 입력하세요"
					class="input-underline"
					maxlength="50"
				/>
				<div
					v-if="this.txtValidCheckEmail != ''"

					class="mt-10 text-right color-red"
				>{{ this.txtValidCheckEmail }}</div>
			</div>

			<div
				class="mt-10"
			>
				<h6>이용약관 및 쇼핑정보 수신동의</h6>
				<div
					class="mt-10 input-box"
				>이용약관</div>

				<div
					class="mt-10 mb-30"
					@click="item.is_agree = !item.is_agree"
				>
					<v-icon
						v-if="item.is_agree"
						class="color-green"
					>mdi mdi-checkbox-marked</v-icon>
					<v-icon
						v-else
					>mdi mdi-checkbox-blank-outline</v-icon>

					이용약관 및 SMS 수신 동의
				</div>
			</div>
		</div>

		<div
			class="bottom"
		>
			<button
				:disabled="!isNext"
				class="btn btn-identify"
				@click="next"
			>다음</button>
		</div>

		<DaumPost
			:overlay="daumPostUp"
			@callBack="addPost"
		></DaumPost>

	</div>
</template>


<script>

import DaumPost from '@/components/Daum/DaumPost'

export default{
	name: 'AppLogin'
	,props: ['Axios', 'codes', 'rules']
	, components: { DaumPost }
	,data: function(){
		return {
			program: {
				name: '회원가입'
				, code: 'join'
				, top: false
				, title: true
				, bottom: false
				, class: 'white'
				, wrap: 'join'
				, callBack: {
					name: 'info'
					,event: 'prev'
				}
			}
			,search: {
				COMPFRNAME: ''
			}
			,daumPostUp: false
			,txtValidCheckPass: ''
			,txtValidCheckEmail: ''
			,txtValidCheckCompany: ''
			,item: {
				member_id: ''
				,member_email: ''
				,admin_code: this.$route.params.code
				,is_agree: false
			}
			,is_check_id: false
		}
	}
	,computed: {
		isNext: function(){
			const self = this
			const required = ['member_id', 'member_password', 'member_password_confirm', 'member_name', 'member_post', 'member_addr1', 'member_addr2', 'member_phone', 'member_email', 'is_agree']
			let isNext = false
			for(let i = 0; i < required.length; i++){
				if(!self.item[required[i]]){
					isNext = true
					break
				}
			}

			// 비밀번호 유효성 검사
			let isPass = this.rules.password(self.item, 'member_password')
			if(isPass === true){
				self.txtValidCheckPass = ''
			}else{
				self.txtValidCheckPass = isPass
				isNext = true
			}

			// 비밀번호 체크
			if(self.item['member_password_confirm'] != self.item['member_password']){
				isNext = true
			}

			// 이메일 유효성 검사
			if(this.rules.email(self.item, 'member_email')){
				self.txtValidCheckEmail = ''
			}else{
				if(self.item.member_email.length == 0){
					self.txtValidCheckEmail = ''
				}else{
					self.txtValidCheckEmail = '잘못된 형식의 이메일 주소입니다.'
				}

				isNext = true
			}

			return isNext
		}
		,isGetAdminCode: function(){
			if(this.$route.params.code){
				return true
			}else{
				return false
			}
		}
		,isCheckId: function(){
			if(this.is_check_id){
				return true
			}else{
				return false
			}
		}
	}
	,methods: {
		daumPost: function (type) {
			this.$emit('setOverlay')
			this.daumPostUp = true
			this.daumPostType = type
		}
		, addPost: function (call) {

			this.$set(this.item, 'member_post', call.zonecode)
			this.$set(this.item, 'member_addr1', call.address)

			this.daumPostUp = false
			this.$emit('setOverlay')
		}
		,next: async function(){

			try{

				let result = await this.Axios({
					method: 'post'
					,url: '/auth/postJoin'
					,data: this.item
				})
				if(result.success){
					this.toJoinResult()
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch(e){
				console.log(e.message)
				this.$bus.$emit('notify', { type: 'error', message: e})
			}
		}
		,toJoinResult: function(){
			this.$router.push({ name: 'JoinResult'})
		}
		,toBack: function(){
			this.$router.back()
		}
	}
	,created: function(){
		this.$emit('setProgram', this.program)
	}
}
</script>

<style>

</style>