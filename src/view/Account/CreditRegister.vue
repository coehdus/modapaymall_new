<template>
	<div class="full-height bg-gray-light">
		<div
			class="full-height flex-column"
		>
			<div
				class="bg-title position-relative justify-space-between bg-white"
			>
				<button
					:title="program.name"
					@click="$router.back()"
				><v-icon large class="">mdi-chevron-left</v-icon><span class=" font-weight-bold size-em-15 vertical-middle">{{ program.name }}</span></button>
			</div>

			<div
				v-if="pg_info.uid"
				class="pa-10 flex-column full-height overflow-y-auto bg-gray-light"
			>
				<div class="bg-white pa-20 size-px-16 ">
					<div class="flex-row justify-space-between">
						<button
							:class="{on: item_credit.credit_type == '1'}"
							class="flex-1 btn btn-primary-outline radius-l-20 pa-10"
							@click="item_credit.credit_type = '1'"
						>개인</button>
						<button
							:class="{on: item_credit.credit_type == '2'}"
							class="flex-1 btn btn-primary-outline radius-r-20 pa-10"
							@click="item_credit.credit_type = '2'"
						>법인</button>
					</div>
					<div class="mt-20">
						<label
						>카드번호</label>
						<div class="flex-row justify-center  mt-10 box radius-20 pa-10">
							<input
								v-model="item_credit.credit_number[0]"
								placeholder="0000"
								class="flex-1 width-auto text-center"
								type="number"
								:rules="rules.numeric(item_credit.credit_number, 0, 4)"
								@keyup="onFocus($event, 4, 'credit_number_1')"
							/>
							<input
								v-model="item_credit.credit_number[1]"
								placeholder="0000"
								class="flex-1 width-auto text-center"
								ref="credit_number_1"
								type="password"
								:rules="rules.numeric(item_credit.credit_number, 1, 4)"
								@keyup="onFocus($event, 4, 'credit_number_2')"
							/>
							<input
								v-model="item_credit.credit_number[2]"
								placeholder="0000"
								class="flex-1 width-auto text-center"
								ref="credit_number_2"
								type="password"
								:rules="rules.numeric(item_credit.credit_number, 2, 4)"
								@keyup="onFocus($event, 4, 'credit_number_3')"
							/>
							<input
								v-model="item_credit.credit_number[3]"
								placeholder="0000"
								class="flex-1 width-auto text-center"
								ref="credit_number_3"
								type="number"
								:rules="rules.numeric(item_credit.credit_number, 3, 4)"
								@keyup="onFocus($event, 4, 'valid_term_year')"
							/>
						</div>
					</div>
					<div class="mt-20">
						<div>
							<label
							>유효기간</label>
							<div class="mt-10 flex-row justify-space-betweens ">
								<input
									v-model="item_credit.valid_term_year"
									:rules="rules.numeric(item_credit, 'valid_term_year', 2)"
									class="input-box mr-10 text-center"
									ref="valid_term_year"
									placeholder="mm"
									@keyup="onFocus($event, 2, 'valid_term_mm')"
								>
								<input
									v-model="item_credit.valid_term_mm"
									:rules="rules.numeric(item_credit, 'valid_term_mm', 2)"
									class="input-box text-center"
									ref="valid_term_mm"
									placeholder="yy"
									@keyup="onFocus($event, 2, 'valid_cvc')"
								>
							</div>
						</div>
					</div>
					<div class="mt-20 flex-row justify-space-between">
						<div class="flex-1 mr-10">
							<label
							>CVC</label>
							<input
								v-model="item_credit.valid_cvc"
								class="mt-10 input-box text-center"
								placeholder="CVC 3자리 숫자"
								ref="valid_cvc"
								:rules="rules.numeric(item_credit, 'valid_cvc', 3)"
								@keyup="onFocus($event, 3, 'credit_pw')"
							>
						</div>
						<div class="flex-1">
							<label
							>카드 비밀번호</label>
							<input
								v-model="item_credit.credit_pw"
								type="password"
								class="mt-10 input-box text-center"
								placeholder="비밀번호 앞 2자리"
								ref="credit_pw"
								:rules="rules.numeric(item_credit, 'credit_pw', 2)"
								@keyup="onFocus($event, 2, 'credit_owner_info')"
							>
						</div>
					</div>
					<div
						v-if="item_credit.credit_type == '1'"
						class="mt-20"
					>
						<label
						>생년월일</label>
						<input
							v-model="item_credit.credit_owner_info"
							type="password"
							class="mt-10 input-box"
							ref="credit_owner_info"
							placeholder="생년월일 6자리"
							:rules="rules.numeric(item_credit, 'credit_owner_info', 6)"
						>
					</div>
					<div
						v-else
						class="mt-20"
					>
						<label
						>사업자등록번호</label>
						<input
							v-model="item_credit.credit_owner_info"
							type="password"
							class="mt-10 input-box"
							ref="credit_owner_info"
							placeholder="사업자등록 번호 10자리"
							:rules="rules.numeric(item_credit, 'credit_owner_info', 10)"
						>
					</div>
				</div>
			</div>

			<div
				v-else
				class="pa-20"
			>
				<div
					class="bg-white pa-10"
				>
					빌링결제 정보가 없습니다.
					관리자에게 문의하세요
				</div>
			</div>

			<div
				v-if="pg_info.uid"
				class="mt-auto"
			>
				<button
					class="btn btn-identify"
					@click="postCredit"
				>확인</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'CreditRegister'
		, props: ['Axios', 'member_info', 'rules']
		, data: function(){
			return {
				program: {
					name: '신용카드 등록'
					,code: 'mypage'
					,wrap: 'mypage'
					,top: false
					,title: false
					,bottom: false
					,class: 'blue'
				}
				, item_credit: {
					credit_type: '1'
					, credit_number: []
				}
				, is_result: false
				, result_type: false
				, pg_info: {}
			}
		}
		, computed: {
			credit_number: function(){
				let t = this.item_credit.credit_number.join('')
				return t
			}
		}
		, methods: {
			postCredit: async function(){
				try{
					this.$bus.$emit('on', true)
					let result = await this.Axios({
						method: 'post'
						,url: '/billgateauto/postPay'
						, data: {
							credit_type: this.item_credit.credit_type
							, credit_number: this.credit_number
							, valid_term_year: this.item_credit.valid_term_year
							, valid_term_mm: this.item_credit.valid_term_mm
							, valid_cvc: this.item_credit.valid_cvc
							, credit_pw: this.item_credit.credit_pw
							, credit_owner_info: this.item_credit.credit_owner_info
							, pg_uid: this.pg_info.uid
						}
					})
					if(result.success){
						this.$emit('push', { name: 'CreditList'})
					}else{
						throw result.message
					}
				}catch(e){
					// console.log(e.message)
					this.$bus.$emit('notify', { type: 'error', message: e})
				}finally {
					this.$bus.$emit('on', false)
				}
			}

			, onFocus: function(e, max, target){
				if(e.target.value.length >= max){
					this.$refs[target].focus()
				}
			}
			, toList: function(){
				this.$emit('goBack')
			}
			, toCancel: function(){
				this.is_result = false
				this.$bus.$emit('onLoad', this.program)
			}
			, getBillInfo: async function(){
				try {
					this.$bus.$emit('on', true)
					const result = await this.Axios({
						method: 'get'
						,url: 'order/getBillInfo'
						,data: {
						}
					})
					if(result.success){
						this.pg_info = result.data
					}else{
						throw result.message
					}
				}catch (e) {
					this.$bus.$emit('notify', { type: 'error', message: e})
				}finally {
					this.$bus.$emit('on', false)
				}
			}
		}
		, created() {
			this.$emit('onLoad', this.program)
			this.getBillInfo()
		}
	}
</script>

<style>
	.btn-primary-outline { border: 1px solid #bbb; color: #bbb;}
	.btn-primary-outline.on { border: 1px solid black; color: black; background-color: white}
</style>