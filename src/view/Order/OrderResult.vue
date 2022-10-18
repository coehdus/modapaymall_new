<template>
	<div
		class="full-height flex-column bg-gray-light"
	>
		<div
			class="pa-10 full-height pb-30 overflow-y-auto "
		>
			<div class="">

				<h6>주문정보</h6>
				<div class="pa-10 box-shadow bg-white">
					<div
						class="justify-space-between font-weight-bold under-line-dashed pb-10"
					>
						<span>주문번호</span>
						<span>{{ item.order_num_new }}</span>
					</div>

					<div
						class="mt-10 justify-space-between"
					>
						<span class="font-weight-bold">주문일시</span>
						<span>{{ item.wDate }}</span>
					</div>
				</div>
			</div>

			<div class="mt-10">
				<h6>주문자 정보</h6>
				<div
					class="pa-10 bg-white box-shadow"
				>
					<div class=" justify-space-between under-line-dashed pb-10">
						<span class="font-weight-bold">이름</span>
						<span>{{ item.member_name }}</span>
					</div>
					<div class="mt-5  justify-space-between under-line-dashed pb-10">
						<span class="font-weight-bold">연락처</span>
						<span>{{ item.member_tell }}</span>
					</div>
					<div class="mt-5  justify-space-between ">
						<span class="font-weight-bold">이메일</span>
						<span>{{ item.member_email }}</span></div>
				</div>
			</div>

			<div class="mt-10">

				<h6>배송지 정보</h6>

				<div
					class="bg-white pa-10 box-shadow"
				>
					<div class=" justify-space-between under-line-dashed">
						<span class="font-weight-bold">받는분 이름</span>
						<span class="font-weight-bold">{{ item.d_name }}</span>
					</div>
					<div class="mt-10  justify-space-between under-line-dashed">
						<span class="font-weight-bold">받는분 연락처</span>
						<span class="font-weight-bold">{{ item.d_tell }}</span>
					</div>
					<div class="mt-10 text-right font-weight-bold">
						{{ item.d_post }}
						{{ item.d_addr1 }}
						{{ item.d_addr2 }}
					</div>

				</div>
			</div>

			<div class="mt-10">
				<h6>상품 정보</h6>
				<div></div>
			</div>

			<template
				v-if="item.supply_list.length > 0"
			>
				<ul class="">
					<li
						v-for="(supply, item_index) in item_list"
						:key="item_index"
						class="under-line mb-10  bg-white box-shadow"
					>
						<div
							class="pa-10 under-line font-weight-bold"
						><v-icon>mdi mdi-home-modern</v-icon>{{ supply.shop_name }}</div>
						<ul>
							<li
								v-for="(odt, product_index) in supply.odt_list"
								:key="'product_' + product_index"
								class="pa-10 under-line full-height justify-space-between"
							>
								<div class="flex-1 full-height pdt-img justify-center flex-column mr-10">
									<img
										v-if="odt.pdt_img"
										:src="odt.pdt_img"
									/>
									<v-icon
										v-else
									>mdi mdi-image</v-icon>
								</div>
								<div class="flex-3">
									<div class="under-line justify-space-between">
										{{ odt.pdt_name }}
									</div>
									<div
										class="under-line-dashed"
									>
										<div class="  color-gray">
											<span>선택옵션: </span>
											<span>{{ odt.op_name}}</span>
										</div>
										<div
											class=" justify-space-between"
										>
											<span
												class="flex-2 font-weight-bold"
											>{{ odt.pdt_price | makeComma }} 원</span>

											<span>수량: {{ odt.op_cnt }} 개</span>
										</div>
									</div>
								</div>
							</li>
						</ul>
						<div
							class="pa-10 justify-space-between under-line-dashed"
						>
							<span class="font-weight-bold">상품 합계</span>
							<span class="color-blue font-weight-bold">{{ supply.total_price | makeComma }} 원</span>
						</div>
						<div
							class="mt-10 prl-10 justify-space-between "
						>
							<span class="font-weight-bold">배송비 <span class="size-px-11">{{ supply.delivery_type_agency }}</span></span>
							<span class="font-weight-bold">{{ supply.delivery_price_agency | makeComma }} 원</span>
						</div>
						<div
							v-if="supply.island_delivery > 0"
							class="prl-10 mb-10 justify-space-between "
						>
							<span class="font-weight-bold">도서 산간 추가배송비</span>
							<span class="font-weight-bold">{{ supply.island_delivery | makeComma }} 원</span>
						</div>
					</li>
				</ul>
			</template>

			<h6 class="mt-10">결제 정보</h6>
			<div
				class="pa-10 bg-white box-shadow font-weight-bold"
			>
				<div class=" justify-space-between under-line-dashed">
					<span class="font-weight-bold">결제금액</span>
					<span><span class="color-blue font-weight-bold">{{ item.order_price | makeComma }}</span> 원</span>
				</div>
				<div class=" mt-5  justify-space-between under-line-dashed">
					<span class="font-weight-bold">결제</span>
					<span>{{ pay_div }}</span>
				</div>
				<div class=" mt-5  justify-space-between under-line-dashed">
					<span class="">결제 상태</span>
					<span>{{ order_status }}</span>
				</div>
				<div class=" mt-5 text-right ">
					{{ item.pay_info }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'OrderResult'
	,props: ['Axios', 'codes', 'TOKEN']
	,data: function(){
		return {
			program: {
				name: '주문완료'
				,top: false
				,title: true
				,bottom: true
				,not_back: true
			}
			,item: {
				result: {

				}
				, supply_list: [

				]
				, order_number: this.order_num_new
			}
		}
	}
	,computed: {
		pay_div: function(){
			let div = ''
			if(this.item.pay_div == 'bank'){
				div = '무통장 입금'
			}else if(this.item.pay_div == 'card'){
				div = '카드 결제'
			}
			return div
		}
		,order_status: function(){
			let status = ''
			if(this.item.o_status == 1){
				status = '입금대기'
			}else{
				status = '결제완료'
			}
			return status
		}
		,item_list: function(){

			let self = this
			return this.item.supply_list.filter(function(item){

				return item.odt_list.filter(function(odt){

					odt.order_status_name = self.codes.odt_status[odt.order_status].name
					odt.order_status_color = self.codes.odt_status[odt.order_status].color
					odt.options = {}
					if(odt.pdt_img1){
						odt.pdt_img = self.codes.img_url + odt.pdt_img1
					}
					switch(odt.order_status){
						case 'step4':
							odt.is_step5 = true
							odt.is_step31 = true
							odt.is_step41 = true
							break;
						case 'step1':
							odt.is_step21 = true
							break;
					}

					return odt
				})
			})
		}
	}
	,methods:{
		getData: async function(){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'order/getOrderDetail'
					,data: {
						TOKEN: this.TOKEN
						,order_num_new: this.$route.params.order_num_new
					}
				})

				if(result.success){
					this.item = result.data
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,toShipping: function(odt){
			this.$emit('toShipping', odt)
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>

<style>
.pdt-img { width: 80px; height: auto; overflow: hidden}
</style>