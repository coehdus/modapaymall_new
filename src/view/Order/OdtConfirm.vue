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

			<div class="mt-30 ">
				<h6 class="size-px-14">평가 별점</h6>
				<div class="justify-center">

					<template
						v-for="num in 5"
					>
						<v-icon
							v-if="item.review_point == 0 || item.review_point < num"
							:key="'star_' + num"
							class="pa-10"
							@click="item.review_point = num"
						>mdi mdi-star-outline</v-icon>
						<v-icon
							v-else
							:key="'star_' + num"
							class="color-star pa-10"
							@click="item.review_point = num"
						>mdi mdi-star</v-icon>
					</template>
				</div>
			</div>

			<div class="mt-30">
				<h6 class="size-px-14">상품평을 작성해주세요</h6>

				<textarea
					v-model="item.review_contents"
					class="box "
					placeholder="상품평 내용을 입력해주세요"
					rows="6"
				></textarea>
			</div>

			<div class="mt-30">
				<h6 class="size-px-14">리뷰 사진을 첨부해주세요</h6>

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
			>확인</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'OdtConfirm'
	,props: ['Axios', 'codes', 'TOKEN']
	,data: function(){
		return{
			program: {
				name: '구매 확정'
				,top: false
				,title: true
				,bottom: false
			}
			,reason_list: [
				{ key: 1, value: '1', name: '단순 변심', price: '반품비: 본인부담'}
				,{ key: 2, value: '2', name: '상품 오배송', price: '반품비: 무료'}
				,{ key: 3, value: '3', name: '상품 파손', price: '반품비: 무료'}
				,{ key: 4, value: '4', name: '기타', price: '반품비: 본인부담'}
			]
			,cancel_item: {
				type: 'return'
				,file: null
			}
			,item: {
				file: ''
				, review_point: 5
			}
		}
	}
	,computed: {
		file_name: function(){
			if(this.item.file){
				return this.item.file.name
			}else{
				// console.log(2)
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
	}
	,methods: {
		setCancelFile: function(e){
			// console.log(e.target.files)
			let file = e.target.files[0]

			this.$set(this.item, 'file', file)
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
					this.item.review_point = 5
				} else {
					this.$bus.$emit('notify', {type: 'error', message: result.message})
				}
			}catch(e){
				this.$bus.$emit('notify', { type: 'error', message: e})
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
						,review_point: this.item.review_point
						,review_contents: this.item.review_contents
						,review_file: this.item.file
						,next_step: 'step5'
					}
				})

				if (result.success) {
					this.$router.back()
					this.$bus.$emit('notify', {type: 'success', message: result.message})
				} else {
					this.$bus.$emit('notify', {type: 'error', message: result.message})
				}
			}catch(e){
				this.$bus.$emit('notify', { type: 'error', message: e})
			}finally {
				this.$bus.$emit('on', false)
			}
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