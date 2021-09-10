<template>
	<div
		class="full-height flex-column position-fixed bg-white"
		style="width: 100%; z-index: 1; top: 0; left: 0;"
	>
		<div
			class="bg-title bg-base"
			:class="program.class"
		>
			<button
				@click="$emit('click')"
			><v-icon large class="color-eee">mdi-chevron-left</v-icon><span class="color-eee font-weight-bold size-em-15 vertical-middle">{{ program.name }}</span></button>
		</div>

		<div class=" full-height flex-column overflow-y-auto">
			<div class="pa-10 full-height flex-column overflow-y-auto">
				<div
					class="mt-10 justify-space-between"
				>
					<button
						class="flex-1 box pa-5-20"
						:class="{ 'bg-red': cancel_item.type == 'return'}"
						@click="cancel_item.type = 'return'"
					>반품</button>
					<button
						class="flex-1 box pa-5-20"
						:class="{ 'bg-red': cancel_item.type == 'change'}"
						@click="cancel_item.type = 'change'"
					>교환</button>
				</div>

				<div class="mt-10">
					<h6 class="size-px-14">사유</h6>
					<div
						v-for="reason in reason_list"
						:key="'reason_' + reason.key"
						class="mt-10 pa-10 justify-space-between box mb-10 radius-10"
						@click="$emit('setReason', reason.key)"
					>
						<v-icon
							v-if="cancel_item.reason == reason.key"
							class="color-blue mr-10"
						>mdi mdi-radiobox-marked</v-icon>
						<v-icon
							v-else
							class="mr-10"
						>mdi mdi-radiobox-blank</v-icon>
						<span class="flex-1 size-px-14">{{ reason.name }}</span>
						<span class="size-em-09">{{  reason.price }}</span>
					</div>
				</div>

				<div class="mt-10">
					<h6 class="size-px-14">상세 사유를 작성해주세요</h6>
					<textarea
						v-model="cancel_item.reason_text"
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
							<span v-if="cancel_item.file">{{ file_name }}</span>
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
	</div>
</template>

<script>
export default {
	name: 'OrderCancel'
	,props: ['Axios', 'item']
	,data: function(){
		return{
			program: {
				name: '반품/교환 신청'
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
				,reason: 1
				,reason_text: ''
				,uid: this.item.uid
			}
		}
	}
	,computed: {
		file_name: function(){
			if(this.cancel_item.file){
				console.log(1)
				return this.cancel_item.file.name
			}else{
				console.log(2)
				return '사진을 첨부해주세요'
			}
		}
	}
	,methods: {
		setCancelFile: function(e){
			console.log(e.target.files)
			let file = e.target.files[0]

			this.$set(this.cancel_item, 'file', file)
		}
		,save: async function(){
			try {
				const result = await this.Axios({
					method: 'post'
					, url: 'order/postOdtCancel'
					, data: this.cancel_item
				})

				if (result.success) {
					this.$emit('click')
					this.$emit('setNotify', {type: 'success', message: result.message})
				} else {
					this.$emit('setNotify', {type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
				this.$emit('setNotify', {type: 'error', message: '시스템 오류'})
			}
		}
	}
	,created() {
		this.$emit('setProgram', this.program)
	}
}
</script>