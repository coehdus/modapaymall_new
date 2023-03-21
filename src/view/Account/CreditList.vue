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
				<v-icon
					class="color-blue"
					@click="toCredit"
				>mdi mdi-pencil-box</v-icon>
			</div>
			<ul
				v-if="items_credit.length > 0"
				class="pa-10"
			>
				<li
					v-for="item in items_credit"
					:key="item.uid"

					class="pa-10 box-shadow mb-10 bg-white"
				>
					<div
						class="ptb-10 justify-space-between under-line-dashed"
					>
						<span
							:class="{ 'color-green font-weight-bold': item.is_base == 1 }"
						>{{ item.bill_name }}</span>
						<span>
							<span
								v-if="item.is_main == '1'"
								class="label label-primary"
							>대표카드</span>
							<v-icon
								v-else
								class="color-blue"
								@click="onMain(item)"
							>mdi-marker-check</v-icon>
							<v-icon
								class="color-red ml-10"
								@click="onDelete(item)"
							>mdi-close-box-outline</v-icon>
						</span>
					</div>
				</li>
			</ul>

			<div
				v-else
				class="full-height flex-column justify-center overflow-y-auto"
			>
				<div class="text-center">
					<v-icon
						large
						class="color-base size-px-48"
					>mdi mdi-cloud-off-outline</v-icon>
					<p class="mt-20">등록된 신용카드가 없습니다.</p>
				</div>
			</div>
		</div>

		<PopupConfirm
			v-if="is_on_main"

			@cancel="is_on_main = false"
			@click="postMain"
		>
			<template
				v-slot:title
			>대표카드 설정</template>
			<template
				v-slot:main-txt
			>{{ item_credit.bill_name}}을 대표카드로 설정하시겠습니까?</template>
		</PopupConfirm>

		<PopupConfirm
			v-if="is_on_delete"

			@cancel="is_on_delete = false"
			@click="postCreditDelete"
		>
			<template
				v-slot:title
			>신용카드 삭제</template>
			<template
				v-slot:main-txt
			>{{ item_credit.bill_name}}을 삭제하시겠습니까?</template>
		</PopupConfirm>
	</div>
</template>

<script>

	import PopupConfirm from "@/view/Layout/PopupConfirm";
	export default {
		name: 'CreditList'
		,
		components: {PopupConfirm},
		props: ['member_info', 'Axios']
		, data: function(){
			return {
				program: {
					name: '신용카드 관리'
					,code: 'mypage'
					,wrap: 'mypage'
					,top: false
					,title: false
					,bottom: true
					,class: 'blue'
				}
				, items_credit: []
				, item_more: {}
				, is_more: false
				, is_on_main: false
				, is_on_delete: false
				, item_credit: {}
			}
		}
		, computed: {

		}
		, methods: {
			getCreditList: async function(){
				try{
					this.$bus.$emit('on', true)
					let result = await this.Axios({
						method: 'get'
						,url: '/order/getCreditList'
					})
					if(result.success){
						this.items_credit = result.data
					}else{
						throw result.message
					}
				}catch(e){
					console.log(e.message)
					this.$bus.$emit('notify', { type: 'error', message: e})
				}finally {
					this.$bus.$emit('on', false)
				}
			}
			, toCredit: function(){
				this.$emit('push', { name: 'CreditRegister'})
			}
			, onMain: function(item){
				this.is_on_main = true
				this.item_credit = item
			}
			, onDelete: function(item){
				this.is_on_delete = true
				this.item_credit = item
			}
			, postMain: async function(){
				try{
					this.$bus.$emit('on', true)
					let result = await this.Axios({
						method: 'post'
						, url: '/order/postCreditMain'
						, data: {
							uid: this.item_credit.uid
						}
					})
					if(result.success){
						await this.getCreditList()
						this.is_on_main = false
					}else{
						throw result.message
					}
				}catch(e){
					console.log(e.message)
					this.$bus.$emit('notify', { type: 'error', message: e})
				}finally {
					this.$bus.$emit('on', false)
				}
			}
			, postCreditDelete: async function(){
				try{
					this.$bus.$emit('on', true)
					let result = await this.Axios({
						method: 'post'
						, url: '/order/postCreditDelete'
						, data: {
							uid: this.item_credit.uid
						}
					})
					if(result.success){
						await this.getCreditList()
						this.is_on_delete = false
					}else{
						throw result.message
					}
				}catch(e){
					console.log(e.message)
					this.$bus.$emit('notify', { type: 'error', message: e})
				}finally {
					this.$bus.$emit('on', false)
				}
			}
		}
		, created() {
			this.$emit('onLoad', this.program)
			this.getCreditList()
		}
	}
</script>