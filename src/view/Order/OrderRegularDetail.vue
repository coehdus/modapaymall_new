<template>
	<div
		class="full-height flex-column bg-gray-light"
	>
		<div class="overflow-y-auto">
			<div class="pa-10 mt-10">
				<div
					class="bg-white box-shadow "
				>
					<div class="pa-10 flex-row justify-space-between under-line">
						<div>{{ item_regular.sDate }}</div>
						<div>매월 {{ item_regular.regular_date }}일 / {{ item_regular.regular_rate }}개월</div>
					</div>
					<div class="flex-row items-center under-line pb-10 pa-10">
						<div class="square-64  text-center flex-column justify-center mr-10">
							<img
								v-if="!item_regular.is_error"
								:src="$pdt_img_url + item_regular.pdt_img" class="width-100" @error="item_regular.is_error = true"/>
							<v-icon
								v-else
							>mdi-image-area</v-icon>
						</div>
						<div class="flex-1 flex-column ">
							<div>{{ item_regular.pdt_name }}</div>
						</div>
					</div>

					<div class="pa-10 flex-row justify-space-between under-line">
						<div>{{ item_regular.bill_name }} </div>
						<div>{{ item_regular.order_price | makeComma}}원</div>
					</div>
				</div>
			</div>

			<div
				class="pa-10"
			>
				<ul>
					<li
						class=" bg-white box-shadow mb-10"
					>
						<div class="pa-10 flex-row justify-space-between under-line">
							<div>첫 주문</div>
							<div>{{ item_regular.order_number }}</div>
						</div>
						<div class="pa-10 flex-row justify-space-between under-line-dashed pb-10">
							<span>결제일</span>
							<span>{{ item_regular.wDate }}</span>
						</div>

						<div class="pa-10 flex-row justify-space-between under-line">
							<div>결제금액</div>
							<div>{{ item_regular.order_price | makeComma}}원</div>
						</div>
					</li>
					<li
						v-for="(order, index) in item_regular.order_list"
						:key="'order_' + index"
						class=" bg-white box-shadow mb-10"
					>
						<div
							class="pa-10 flex-row justify-space-between under-line pb-10"
						>
							<div >{{ index + 1}} 회차</div>
							<div>{{ order.order_number }}</div>
						</div>
						<div class="pa-10 flex-row justify-space-between under-line-dashed pb-10">
							<span>결제일</span>
							<span>{{ order.wDate }}</span>
						</div>
						<div class="pa-10 flex-row justify-space-between">
							<span>결제금액</span>
							<span>{{ order.order_price | makeComma }}원</span>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<div class="mt-auto">
			<div v-if="item_regular.is_cancel == 0"><button class="btn btn-secondary" @click="onCancel">구독취소</button></div>
			<div v-else-if="item_regular.is_cancel == 1"><button class="btn btn-primary" >구독완료</button></div>
			<div v-else><button class="btn btn-secondary" >취소 완료</button></div>
		</div>

		<PopupConfirm
			v-if="is_on_cancel"

			@cancel="is_on_cancel = false"
			@click="postRegularCancel"
		>
			<template
				v-slot:title
			>구독 취소</template>
			<template
				v-slot:main-txt
			>정기결제 구독을 취소하시겠습니까?</template>
		</PopupConfirm>
	</div>
</template>

<script>
	import PopupConfirm from "@/view/Layout/PopupConfirm";
	export default {
		name: 'OrderRegularDetail'
		,
		components: {PopupConfirm},
		props: ['Axios', 'member_info', 'TOKEN', 'codes']
		, data: function(){
			return {
				program: {
					name: '정기결제 상세'
					, top: false
					, title: true
					, bottom: false
				}
				, item_regular: {

				}
				, is_on_cancel: false
			}
		}
		, methods: {
			getData: async function(){
				try{
					this.$bus.$emit('on', true)
					const result = await this.Axios({
						method: 'get'
						,url: 'order/getOrderRegularInfo'
						,data: {
							uid: this.$route.params.idx
						}
					})

					if(result.success){
						this.item_regular = result.data
					}else{
						throw result.message
					}
				}catch(e){
					this.$bus.$emit('notify', { type: 'error', message: e })
				}finally {
					this.$bus.$emit('on', false)
				}
			}
			, onCancel: function(){
				this.is_on_cancel = true
			}
			, postRegularCancel: async function(){
				try{
					this.$bus.$emit('on', true)
					const result = await this.Axios({
						method: 'post'
						,url: 'order/postOrderRegularCancel'
						,data: {
							uid: this.$route.params.idx
						}
					})

					if(result.success){
						await this.getData()
					}else{
						throw result.message
					}
				}catch(e){
					this.$bus.$emit('notify', { type: 'error', message: e })
				}finally {
					this.is_on_cancel = false
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