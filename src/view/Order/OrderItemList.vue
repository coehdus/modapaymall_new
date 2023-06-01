<template>
	<div class="full-height">
		<div class="full-height">
			<ul class="full-height overflow-y-auto">
				<li
					v-for="item in item_list"
					:key="item.uid"
					class=" under-line"
					@click="toResult(item.order_num_new)"
				>
					<div
						class="pa-10 bg-gray-light"
					>
						{{ item.wDate }}
					</div>
					<div class="pa-10 justify-space-between">
						<span
							class="pdt-img flex-1 mr-10 flex-column justify-center"
						><img
							:src="$pdt_img_url + item.pdt_img1"
						/></span>
						<div
							class="flex-3 "
						>
							<div class="pa-10 under-line-dashed">{{ item.pdt_name }}</div>
							<div
								class="pa-10 justify-space-between under-line-dashed"
							>
								<span>{{ item.op_name | makeComma }} 원</span>
								<span>수량: {{ item.op_cnt}}개</span>
							</div>
							<div class="pa-10">
								{{ item.order_status_name }}
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'OrderItemList'
		,props: ['Axios', 'date', 'member_info', 'TOKEN']
		,data: function(){
			return {
				program: {
					name: '주문내역'
					,top: false
					,title: true
					,bottom: true
				}
				,search: {
					sDate: this.date.getSearchBaseDate('-')
					,eDate: this.date.getToday()
				}
				,items: [

				]
			}
		}
		,computed: {
			item_list: function(){
				return this.items.filter(function(item){
					switch (item.order_status){
						case 'step1':
							item.order_status_name = '주문접수'
						break;
						case 'step2':
							item.order_status_name = '배송준비중'
							break;
						case 'step3':
							item.order_status_name = '배송중'
							break;
						case 'step4':
							item.order_status_name = '배송완료'
							break;
						case 'step5':
							item.order_status_name = '구매확정'
							break;
						case 'step21':
							item.order_status_name = '주문 취소 요청'
							break;
						case 'step22':
							item.order_status_name = '주문 취소 완료'
							break;
						case 'step31':
							item.order_status_name = '교환 요청'
							break;
						case 'step32':
							item.order_status_name = '교환 처리중'
							break;
						case 'step34':
							item.order_status_name = '교환 완료'
							break;
						case 'step41':
							item.order_status_name = '반품 요청'
							break;
						case 'step42':
							item.order_status_name = '반품 처리중'
							break;
						case 'step43':
							item.order_status_name = '반품 완료'
							break;

					}

					return item
				})
			}
		}
		,methods: {
			getData: async function(){
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'order/getOrderList'
						,data: this.search
					})

					if(result.success){
						this.items = result.data.result.result
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message})
					}
				}catch (e) {
					this.$bus.$emit('notify', { type: 'error', message: e})
				}
			}
			,toResult: function(order_number){
				this.$router.push({ name: 'OrderResult', params: { order_number: order_number }})
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
</script>

<style>
	.pdt-img img { width: 100%}
</style>