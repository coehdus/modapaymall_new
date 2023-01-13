<template>
	<div
		class="full-height flex-column  bg-white"
	>
		<div class="mt-10 pa-10 full-height flex-column overflow-y-auto">
			<div>
				<h6 class="size-px-14">구매 상품</h6>
				<div
					class=" justify-space-between "
				>
					<span class="flex-1 pdt-img mr-10 flex-column justify-center mr-10">
						<img
							v-if="pdt_img"
							:src="pdt_img"
						/>
						<v-icon
							v-else
						>mdi mdi-image</v-icon>
					</span>
					<div class="flex-3">
						<div>{{ item.pdt_name}} <span class="color-gray size-em-09">선택 옵션: {{ item.op_name }}</span></div>
						<div class="mt-5 ">
							<span class="font-weight-bold">{{ item.pdt_price | makeComma }} 원</span>
							<span class="size-em-09"> 수량: {{ item.op_cnt }}개</span>
						</div>
					</div>
				</div>
			</div>
			<div
				class="mt-10 justify-space-between"
			>
				<button
					class="flex-1 box pa-5-20"
					:class="{ 'bg-red': type == 'step31'}"
					@click="type = 'step31'"
				>교환</button>
				<button
					class="flex-1 box pa-5-20"
					:class="{ 'bg-red': type == 'step41'}"
					@click="type = 'step41'"
				>반품</button>
			</div>

			<div class="mt-10">
				<h6 class="size-px-14">사유</h6>
				<template
					v-if="reason_list.length > 0"
				>
					<template
						v-for="(reason, index) in reason_list"
					>
						<div
							v-if="index > 0"
							:key="'reason_' + reason.total_code"
							class="mt-10 pa-10 justify-space-between box mb-10 radius-10"
							@click="setReason(reason.total_code)"
						>
							<v-icon
								v-if="item.reason == reason.total_code"
								class="color-blue mr-10"
							>mdi mdi-radiobox-marked</v-icon>
							<v-icon
								v-else
								class="mr-10"
							>mdi mdi-radiobox-blank</v-icon>
							<span class="flex-1 size-px-14">{{ reason.code_name }}</span>
							<span class="size-em-09">{{  reason.code_text }}</span>
						</div>
					</template>
				</template>
			</div>

			<div class="mt-10">
				<h6 class="size-px-14">상세 사유를 작성해주세요</h6>
				<textarea
					v-model="item.reason_text"
					class="box "
					placeholder="판매자에게 전달할 내용을 입력해주세요"
					rows="6"
				></textarea>
				<div class="mt-10 pa-10 box">
					<label>
						<v-icon
							class="mr-10"
						>mdi mdi-camera</v-icon>
						<input v-show="false" type="file" @change="setCancelFile"/>
						<span v-if="item.file">{{ file_name }}</span>
					</label>
				</div>
			</div>
		</div>
		<div
			class="mt-auto"
		>
			<button
				class="pa-10 btn-identify"
				@click="save"
			>신청하기</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'OdtReturn'
	,props: ['Axios', 'TOKEN', 'codes']
	,data: function(){
		return{
			program: {
				name: '반품/교환 신청'
				,top: false
				,title: true
				,bottom: false
			}
			,item: {
			}
			,type: 'step31'
			,reason: ''
			,reason_text: ''
		}
	}
	,computed: {
		file_name: function(){
			if(this.item.file){
				return this.item.file.name
			}else{
				console.log(2)
				return '사진을 첨부해주세요'
			}
		}
		,pdt_img: function(){
			if(this.item.pdt_img1) {
				return this.codes.img_url + this.item.pdt_img1
			}else{
				return ''
			}
		}
		,reason_list: function(){
			if(this.codes.R001){
				return this.codes.R001.items.filter(function(item){
					if(item.code_value == 1){
						item.code_text = '택배비: 본인부담'
					}else{
						item.code_text = '택배비: 비용없음'
					}
					return item
				})
			}else{
				return []
			}
		}
	}
	,methods: {
		setCancelFile: function(e){
			console.log(e.target.files)
			let file = e.target.files[0]

			this.$set(this.cancel_item, 'file', file)
		}
		,getData: async function(){

			this.$bus.$emit('on', true)
			try {
				const result = await this.Axios({
					method: 'get'
					, url: 'order/getOdt'
					, data: {
						odt_uid: this.$route.params.odt_uid
					}
				})

				if (result.success) {
					this.item = result.data
					this.$bus.$emit('notify', {type: 'success', message: result.message})
				} else {
					this.$bus.$emit('notify', {type: 'error', message: result.message})
				}
			}catch(e){
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,save: async function(){
			this.$bus.$emit('on', true)
			try {
				const result = await this.Axios({
					method: 'post'
					, url: 'order/postOdtUpdate'
					, data: {
						uid: this.item.uid
						,reason: this.item.reason === undefined ? '' : this.item.reason
						,reason_text: this.item.reason_text === undefined ? '' : this.item.reason_text
						,review_file: this.item.file === undefined ? '' : this.item.file
						,next_step: this.type
					}
				})

				if (result.success) {
					this.$bus.$emit('notify', {type: 'success', message: result.message})
					this.$router.back()
				} else {
					this.$bus.$emit('notify', {type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', {type: 'error', message: '시스템 오류'})
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,setReason: function(reason){
			this.$set(this.item, 'reason', reason)
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>

<style>
.pdt-img { width: 80px; overflow: hidden}
</style>