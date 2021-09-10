<template>
	<div class="full-height flex-column">

		<div
			class="pa-10 full-height pb-30 overflow-y-auto  bg-gray-light"
		>
			<div class="mt-30">
				<h6>주문번호</h6>
				<div
					class="mt-10 size-px-16 text-center input-box box-shadow bg-white"
				>
					{{ item.order_num_new }}
				</div>

				<h6 class="mt-10">결제 정보</h6>
				<div
					class="mt-10 pa-10 bg-white box-shadow"
				>
					<div class="input-box justify-space-between">
						<span>결제금액</span>
						<span><span class="color-blue">{{ item.order_price | makeComma }}</span> 원</span>
					</div>
					<div class=" mt-5 input-box justify-space-between">
						<span>결제</span>
						<span>{{ pay_div }}</span>
					</div>
					<div class=" mt-5 input-box ">
						{{ item.pay_info }}
					</div>
				</div>
			</div>
			<div class="mt-30">
				<h6>상품 정보</h6>
				<div></div>
			</div>

			<template
				v-if="item.odt_list.length > 0"
			>
				<ul class="mt-10">
					<li
						v-for="(item, item_index) in item_list"
						:key="item_index"
						class="under-line mb-10  bg-white box-shadow"
					>
						<div
							class="pa-10 under-line "
						><v-icon>mdi mdi-home-modern</v-icon>{{ item.company.seller_name }}</div>
						<ul>
							<li
								v-for="(product, product_index) in item.items"
								:key="'product_' + product_index"
								class=" under-line justify-space-between"
							>
								<div class="pa-10 flex-1 odt-img justify-center flex-column">
									<img
										v-if="product.pdt_img"
										:src="'http://delimall.co.kr/API/data/product/' + product.pdt_img" alt="main1"
									/>
									<v-icon
										v-else
									>mdi mdi-image</v-icon>
								</div>
								<div class="flex-3">
									<div class=" ptb-10 under-line">{{ product.pdt_name }}</div>
									<div
										v-for="(option, index) in product.options"
										:key="'odt_' + index"
										class=" pa-10 under-line-dashed"
									>
										<div class="justify-space-between">
											<span>옵션</span>
											<span>{{ option.odt }}</span>
										</div>
										<div
											class="mt-10 justify-space-between"
										>
											<span
												class="flex-2 color-blue"
											>{{ option.odt_price | makeComma }}</span>

											<span>{{ option.odt_cnt }} 개</span>
										</div>
									</div>

								</div>
							</li>
						</ul>
						<div
							class="pa-10 justify-space-between under-line-dashed"
						>
							<span>배송비 <span class="size-px-11">{{ item.company.delivery }}</span></span>
							<span>{{ item.company.delivery_price | makeComma }}</span>
						</div>
						<div
							class="pa-10 justify-space-between"
						>
							<span>합계</span>
							<span class="color-blue">{{ item.company.total_price | makeComma }}</span>
						</div>
					</li>
				</ul>
			</template>

			<div class="mt-10">
				<h6>주문자 정보</h6>
				<div
					class="mt-10 pa-10 bg-white box-shadow"
				>
					<div class="input-box">{{ item.member_name }}</div>
					<div class="mt-5 input-box">{{ item.member_tell }}</div>
					<div class="mt-5 input-box">{{ item.member_email }}</div>
					<div class="mt-5 input-box">{{ item.member_post }} {{ item.member_addr1 }}</div>
					<div class="mt-5 input-box">{{ item.member_addr2 }}</div>
				</div>
			</div>
			<div class="mt-30">
				<div
				>
					<h6 class="flex-4">배송지 정보</h6>
				</div>
				<div
					class="mt-10 bg-white pa-10 box-shadow"
				>
					<input
						v-model="item.d_name"
						class="input-box"
						placeholder="이름"
					/>
					<input
						v-model="item.d_tell"
						class="mt-10 input-box"
						placeholder="연락처"
					/>
					<div
						class="mt-10 flex-row"
						@click="daumPost('default')"
					>
						<input
							v-model="item.d_post"
							class="input-box flex-3 mr-10"
							placeholder="우편번호"
							readonly
						/>
						<button
							class="btn btn-blue flex-1"
						>주소 검색</button>
					</div>
					<input
						v-model="item.d_addr1"
						type="text" placeholder="기본 주소"
						class="mt-10 input-box"
						readonly
						maxlength="80"
						@click="daumPost('default')"
					/>
					<input
						v-model="item.d_addr2"
						type="text" placeholder="상세 주소를 입력하세요"
						class="mt-10 input-box"
						maxlength="50"
					/>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
export default {
	name: 'OrderDetail'
	,props: ['Axios', 'item']
	,data: function(){
		return {
			program: {
				name: '주문상세'
				,top: false
				,title: false
				,bottom: true
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
		,item_list: function(){
			let items = {}

			for(const [key ,val] of Object.entries(this.item.odt_list)){
				console.log('key: ' + key)

				if(val.is_not_select){
					continue
				}
				let company = items[val.seller_id]

				if(!company){
					company = {
						company: {
							total_price: 0
						}
						,items: {}
					}
				}

				items[val.seller_id] = company

				items[val.seller_id]['company']['seller_id'] = val.seller_id
				items[val.seller_id]['company']['seller_name'] = val.shop_name
				items[val.seller_id]['company']['total_price'] += ((Number(val.pdt_price) + Number(val.op_price)) * val.op_cnt)
				items[val.seller_id]['company']['delivery_type'] = val.delivery_type
				items[val.seller_id]['company']['delivery_price'] = val.delivery_price

				if(val.delivery_type == '무료'){
					items[val.seller_id]['company']['delivery_price'] = val.delivery_type
					items[val.seller_id]['company']['delivery'] = ''
				}else{
					if(val.free_price > 0){
						items[val.seller_id]['company']['delivery'] = val.free_price + ' 이상 구매시 무료'
						if(val.free_price < items[val.seller_id]['company']['total_price']){
							items[val.seller_id]['company']['delivery_price'] = 0
						}
					}
				}

				let product = items[val.seller_id]['items'][val.pdt_uid]

				if(!product || product === undefined){
					product = {
						pdt_uid: val.pdt_uid
						,pdt_img: val.pdt_img1
						,pdt_name: val.pdt_name
						,pdt_price: val.pdt_price
						,options: {}
					}
				}

				items[val.seller_id]['items'][val.pdt_uid] = product

				let option = items[val.seller_id]['items'][val.pdt_uid]['options'][val.uid]
				if(!option || option === undefined){
					option = {
						odt: val.op_name
						,odt_cnt: val.op_cnt
						,odt_price: Number(val.pdt_price) + Number(val.op_price)
					}
				}

				items[val.seller_id]['items'][val.pdt_uid]['options'][val.uid] = option
			}
			console.log(items)
			return items
		}
	}
	,methods:{
		getData: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'order/getOrderResult'
					,data: this.item
				})

				if(result.success){
					this.item = result.data
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}
		}
	}
	,created() {
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>