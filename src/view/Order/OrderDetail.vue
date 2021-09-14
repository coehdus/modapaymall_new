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
				<h6>상품 정보</h6>
				<div></div>
			</div>

			<template
				v-if="item.supply_list.length > 0"
			>
				<ul class="">
					<li
						v-for="(item, item_index) in item_list"
						:key="item_index"
						class="under-line mb-10  bg-white box-shadow"
					>
						<div
							class="pa-10 under-line font-weight-bold"
						><v-icon>mdi mdi-home-modern</v-icon>{{ item.company.seller_name }}</div>
						<ul>
							<li
								v-for="(odt, product_index) in item.items"
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

										<span
											class="font-weight-bold"
											:class="'color-' + odt.order_status_color"
										>{{ odt.order_status_name }}</span>
									</div>
									<div
										v-for="(option, index) in odt.options"
										:key="'odt_' + index"
										class="under-line-dashed"
									>
										<div class="  color-gray">
											<span>선택옵션: </span>
											<span>{{ option.odt }}</span>
										</div>
										<div
											class=" justify-space-between"
										>
											<span
												class="flex-2 font-weight-bold"
											>{{ option.pdt_price | makeComma }} 원</span>

											<span>수량: {{ option.odt_cnt }} 개</span>
										</div>
									</div>
									<div class="mt-10 size-px-10">
										<span
											v-if="odt.is_step21"
											class="box prl-10 bg-red"
											@click="toOdtStatus('step21')"
										>주문 취소</span>
										<span
											v-if="odt.is_step31"
											class="box prl-10 bg-orange"
											@click="toOdtStatus('step31')"
										>교환 요청</span>
										<span
											v-if="odt.is_step41"
											class="box prl-10 bg-orange"
											@click="toOdtStatus('step41')"
										>반품 요청</span>
										<span
											v-if="odt.is_step5"
											class="box prl-10 bg-green"
											@click="toOdtStatus('step5')"
										>구매 확정</span>
										<span
											v-if="odt.shipping_num"
											class="box prl-10 ml-5"
											@click="toShipping(odt)"
										>배송조회</span>
									</div>
								</div>
							</li>
						</ul>
						<div
							class="pa-10 justify-space-between under-line-dashed"
						>
							<span class="font-weight-bold">상품 합계</span>
							<span class="color-blue font-weight-bold">{{ item.company.total_price | makeComma }} 원</span>
						</div>
						<div
							class="pa-10 justify-space-between "
						>
							<span class="font-weight-bold">배송비 <span class="size-px-11">{{ item.company.delivery }}</span></span>
							<span class="font-weight-bold">{{ item.company.delivery_price | makeComma }} 원</span>
						</div>
					</li>
				</ul>
			</template>

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
				name: '주문상세'
				,top: false
				,title: true
				,bottom: true
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
			let items = {}

			let self = this
			for(const [s_key ,s_val] of Object.entries(this.item.supply_list)) {
				console.log(s_key)

				let company = items[s_val.seller_id]

				if (!company) {
					company = {
						company: {
							total_price: 0
						}
						, items: {}
					}
				}

				items[s_val.seller_id] = company

				items[s_val.seller_id]['company']['seller_id'] = s_val.seller_id
				items[s_val.seller_id]['company']['seller_name'] = s_val.shop_name
				items[s_val.seller_id]['company']['total_price'] = s_val.total_price
				items[s_val.seller_id]['company']['delivery_type'] = s_val.delivery_type
				items[s_val.seller_id]['company']['delivery_price'] = s_val.delivery_price

				for (const [key, val] of Object.entries(s_val.odt_list)) {
					console.log('key: ' + key)

					let product = items[s_val.seller_id]['items'][val.pdt_uid]

					if (!product || product === undefined) {
						val.order_status_name = self.codes.odt_status[val.order_status].name
						val.order_status_color = self.codes.odt_status[val.order_status].color
						val.options = {}
						if(val.pdt_img1){
							val.pdt_img = self.codes.img_url + val.pdt_img1
						}
						switch(val.order_status){
							case 'step4':
								val.is_step5 = true
								val.is_step31 = true
								val.is_step41 = true
								break;
							case 'step1':
								val.is_step21 = true
								break;
						}
						product = val
					}

					items[s_val.seller_id]['items'][val.pdt_uid] = product

					let option = items[s_val.seller_id]['items'][val.pdt_uid]['options'][val.uid]
					if (!option || option === undefined) {
						option = {
							odt: val.op_name
							, odt_cnt: val.op_cnt
							, odt_price: val.op_price
							, pdt_price: val.pdt_price
						}
					}

					items[val.seller_id]['items'][val.pdt_uid]['options'][val.uid] = option
				}
			}
			console.log(items)
			return items
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
					this.$emit('setNotify', { type: 'error', message: result.message })
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