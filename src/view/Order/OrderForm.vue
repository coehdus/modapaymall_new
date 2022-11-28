<template>
	<div
		class="full-height flex-column"
	>
		<div
			class="pa-10 full-height pb-30 overflow-y-auto  bg-gray-light">
			<div class="mt-10">
				<h6>주문자 정보</h6>
				<div
					class="mt-10 pa-10 bg-white box-shadow"
				>
					<div class="input-box-5 bg-gray-light">{{ member_info.member_name }}</div>
					<div
						class="mt-10 position-relative"
					>
						<label>
						<input
							type="number"
							v-model="item.member_tell"
							class="input-box-5"
							placeholder="연락처를 입력하세요"
							:rules="[rules.max(item, 'member_tell', 15)]"
						/>
						<v-icon
							class="position-absolute"
							style="right: 10px; top: 7px"
						>mdi mdi-keyboard</v-icon>
						</label>
					</div>
					<div
						v-if="false"
						class="mt-10 position-relative"
					>
						<label>
							<input
								type="email"
								v-model="item.member_email"
								class="input-box-5"
								placeholder="이메일주소를 입력하세요"
								:rules="[rules.max(item, 'member_email', 50)]"
							/>
							<v-icon
								class="position-absolute"
								style="right: 10px; top: 7px"
							>mdi mdi-keyboard</v-icon>
						</label>
					</div>
				</div>
			</div>

			<div class="mt-30">
				<div
					class="justify-space-between"
				>
					<h6 class="flex-1">배송 구분</h6>
				</div>

				<div
					class="mt-10 bg-white pa-10 box-shadow"
				>

					<div
					>
						<label class="mr-10"><input v-model="item.delivery_type" type="radio" value="D002001" /> 택배 수령</label>
						<label><input v-model="item.delivery_type" type="radio" value="D002002" /> 방문 수령</label>
					</div>

				</div>

			</div>

			<div
				v-if="item.delivery_type == 'D002001'"
				class="mt-30"
			>
				<div
					class="justify-space-between"
				>
					<h6 class="flex-1">배송지 정보</h6>
					<div class="flex-column justify-center">
						<button
							class="btn-blue size-px-11 prl-10 font-weight-normal"
							@click="showSipping"
						>배송지 목록</button>
					</div>
				</div>
				<div
					class="mt-10 bg-white pa-10 box-shadow"
				>
					<div
						class="justify-space-between"
					>
						<label
							class="size-em-09"
						>
							<v-icon
								v-if="!item.shipping_uid || item.shipping_uid == 'new'"
								@click="item.shipping_uid = 'not'"
								class="size-px-20 color-blue"
							>mdi mdi-checkbox-marked</v-icon>
							<v-icon
								v-else
								@click="item.shipping_uid = 'new'"
								class="size-px-20"
							>mdi mdi-checkbox-blank-outline</v-icon>
							신규 배송지로 등록

						</label>

						<label
							class="size-em-09"
						>
							<v-icon
								v-if="item.is_base == '0'"
								@click="item.is_base = '1'"
								class="size-px-20"
							>mdi mdi-checkbox-blank-outline</v-icon>
							<v-icon
								v-else
								@click="item.is_base = '0'"
								class="size-px-20 color-blue"
							>mdi mdi-checkbox-marked</v-icon>
							기본 배송지로 사용
						</label>
					</div>
					<div
						class="mt-10 position-relative"
					>
						<label>
							<input
								v-model="item.shipping_name"
								class="input-box-5"
								placeholder="배송지 명"
								maxlength="25"
							/>
							<v-icon
								class="position-absolute"
								style="right: 10px; top: 7px;"
							>mdi mdi-keyboard</v-icon>
						</label>
					</div>
					<div
						class="mt-10 position-relative"
					>
						<label>
							<input
								v-model="item.d_name"
								class="input-box-5"
								placeholder="이름"
								maxlength="25"
							/>
							<v-icon
								class="position-absolute"
								style="right: 10px; top: 7px;"
							>mdi mdi-keyboard</v-icon>
						</label>
					</div>
					<div
						class="mt-10 position-relative"
					>
						<label>
						<input
							type="number"
							v-model="item.d_tell"
							class=" input-box-5"
							placeholder="연락처"
							:rules="[rules.max(item, 'd_tell', 15)]"
						/>
						<v-icon
							class="position-absolute"
							style="right: 10px; top: 7px;"
						>mdi mdi-keyboard</v-icon>
						</label>
					</div>
					<div
						class="mt-10 flex-row"
						@click="daumPost('default')"
					>
						<input
							type="number"
							v-model="item.d_post"
							class="input-box-5 flex-3 mr-10"
							placeholder="우편번호"
							readonly
							:rules="[rules.max(item, 'd_post', 7)]"
						/>
						<button
							class=" btn-blue flex-1"
						>주소 검색</button>
					</div>
					<input
						v-model="item.d_addr1"
						type="text" placeholder="기본 주소"
						class="mt-10 input-box-5"
						readonly
						maxlength="80"
						@click="daumPost('default')"
					/>
					<div
						class="mt-10 position-relative"
					>
						<label>
						<input
							v-model="item.d_addr2"
							type="text" placeholder="상세 주소를 입력하세요"
							class="input-box-5"
							maxlength="50"
						/>
						<v-icon
							class="position-absolute"
							style="right: 10px; top: 7px;"
						>mdi mdi-keyboard</v-icon>
						</label>
					</div>
				</div>
			</div>

			<div
				v-else
				class="mt-10"
			>
				<div
					class="bg-white pa-10 box-shadow"
				>주문한 상품을 매장에 직접방문하여 수령합니다</div>
			</div>

			<div class="mt-30">
				<h6>상품 정보</h6>
				<div></div>
			</div>

			<template
				v-if="use_item.length > 0"
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
										:src="$pdt_img_url + product.pdt_img" alt="main1"
									/>
									<v-icon
										v-else
									>mdi mdi-image</v-icon>
								</div>
								<div class="pa-10 flex-3">
									<div class="  under-line-dashed ">{{ product.pdt_name }}</div>
									<div
										v-for="(option, index) in product.options"
										:key="'odt_' + index"
										class="  under-line-dashed"
									>
										<div class="justify-space-between">
											<span>선택 옵션 {{ option.odt }}</span>
										</div>
										<div
											class=" justify-space-between under-line-dashed"
										>
											<span
												class="flex-2 color-blue"
											>{{ option.odt_price | makeComma }} 원</span>

											<span>{{ option.odt_cnt }} 개</span>
										</div>
									</div>

								</div>
							</li>
						</ul>
						<div
							class="pa-10 justify-space-between under-line-dashed"
						>
							<span>상품 합계</span>
							<span class="color-blue">{{ item.company.total_price | makeComma }} 원</span>
						</div>
						<div
							class="pa-10 justify-space-between "
						>
							<span>
								배송비 <br/>
								<span class="size-px-11">{{ item.company.delivery }}</span>
							</span>
							<span>{{ item.company.delivery_price | makeComma }} 원</span>
						</div>
						<div
							v-if="is_island_delivery"
							class="pa-10 justify-space-between "
						>
							<div
							>
								도서/산간 추가배송비
							</div>
							<span>{{ item.company.island_price | makeComma }} 원</span>
						</div>
					</li>
				</ul>
			</template>
			<div
				v-else
				class="full-height flex-column justify-center"
			>
				<div class="text-center">No Data</div>
			</div>
			<div class="mt-30">
				<h6>결제 정보</h6>
				<div
					class="mt-10 pa-10 bg-white box-shadow"
				>
					<div class="pa-10 justify-space-around under-line-dashed">
						<span
							v-if="shop_info.is_bank == '1'"
							@click="item.pay_div = 'bank'"
						>
							<v-icon
								v-if="item.pay_div == 'bank'"
								class="color-green"
							>mdi mdi-radiobox-marked</v-icon>
							<v-icon
								v-else
							>mdi mdi-radiobox-blank</v-icon>
							<span> 무통장 입금</span>
						</span>
						<span
							v-if="shop_info.is_card == '1'"
							@click="doPaymentCard"
						>
							<v-icon
								v-if="item.pay_div == 'card'"
								class="color-green"
							>mdi mdi-radiobox-marked</v-icon>
							<v-icon
								v-else
							>mdi mdi-radiobox-blank</v-icon>
							<span> 카드 결제</span>
						</span>
					</div>
					<div
						class="mt-10"
						v-if="item.pay_div == 'bank'"
					>
						<div>
							무통장 입금 안내
							<div class="mt-10 mb-10">{{ shop_info.bank_name }} {{ shop_info.bank_account }} {{ shop_info.bank_holder}}</div>

							<label
								class="mt-10 position-relative"
							>
								<input
									v-model="item.bank_info"
									placeholder="입금자 명"
									class=" input-box-5"
								/>
								<v-icon
									class="position-absolute"
									style="right: 10px; top: 0px;"
								>mdi mdi-keyboard</v-icon>
							</label>
						</div>
					</div>
				</div>
				<div
					class="pa-30"
				>

				</div>
			</div>
		</div>

		<div
			class="mt-auto flex-column box-shadow position-relative"
		>
			<div>
				<div
					class="pa-10 justify-space-between under-line-dashed"
				>
					<span>총 배송비 </span>
					<span>{{ total_delivery_price | makeComma }} 원</span>
				</div>
				<div
					class="pa-10 flex-row justify-space-between under-line"
				>
					<span
						class="font-weight-bold color-black"
					>총 상품가</span>
					<span
						class="order-price font-weight-bold color-blue"
					>{{ total_price | makeComma }} 원</span>
				</div>
			</div>
			<div
			>
				<button
					class="btn btn-identify"
					@click="checkPayment"
				>
					<span class="color-white size-em-12">{{ order_price | makeComma }} 원 </span>
					<span class="color-white size-em-12"> 결제하기</span>
				</button>
			</div>
		</div>

		<DaumPost
			:overlay="daumPostUp"
			@callBack="addPost"
		></DaumPost>

		<Modal
			:is_modal="is_modal"
			:option="modal_option"

			@close="is_modal = !is_modal"
		>
			<div slot="modal-content">
				<ul
					v-if="shipping_list.length > 0"
				>
					<li
						v-for="shipping in shipping_list"
						:key="shipping.uid"

						class="pa-10 box-shadow mb-10 bg-white"
					>
						<div
							class="ptb-10 justify-space-between under-line-dashed"
						>
						<span
							:class="{ 'color-green font-weight-bold': shipping.is_base == 1 }"
						>{{ shipping.shipping_name }}</span>
							<span>
							<v-icon
								class="color-blue"
								@click="setShipping(shipping)"
							>mdi mdi-arrow-right-bold-box-outline</v-icon>
						</span>
						</div>
						<div class="ptb-10  justify-space-between under-line-dashed">
							<span>{{ shipping.name }}</span>
							<span>{{ shipping.tell }}</span>
						</div>

						<div class="ptb-10">{{ shipping.post }} {{ shipping.addr1 }} </div>
						<div class="">{{ shipping.addr2 }}</div>
					</li>
				</ul>

				<div
					v-else
					class="full-height flex-column justify-center overflow-y-auto"
				>
					<div class="text-center">
						<p class="mt-20">등록된 주소록 정보가 없습니다.</p>
					</div>
				</div>
			</div>
		</Modal>

		<OrderFormReappay
			v-if="is_reappay"
			:order_item="order_item"
			:user="user"
			:Axios="Axios"
			:referrer_code="program.code"
			:pg_info="pg_info"
			:shop_info="shop_info"

			@setNotify="setNotify"
			@success="success"
			@fail="fail"
		></OrderFormReappay>

		<OrderFormAllat
			v-if="is_allat && !is_mobile"
			:Axios="Axios"
			:user="user"
			:member_info="member_info"
			:order_info="order_item"
			:pg_info="pg_info"

			@cancel="fail"
			@success="success"
			@fail="fail"
		></OrderFormAllat>

		<OrderFormAllatM
			v-if="is_allat && is_mobile"
			:Axios="Axios"
			:user="user"
			:member_info="member_info"
			:order_info="order_item"
			:pg_info="pg_info"

			@cancel="fail"
			@success="success"
			@fail="fail"
		></OrderFormAllatM>

	</div>
</template>

<script>
import DaumPost from '@/components/Daum/DaumPost'
import Modal from "@/components/Modal";
import OrderFormReappay from "@/view/Order/OrderFormReappay";
import OrderFormAllat from "@/view/Order/OrderFormAllat";
import OrderFormAllatM from "@/view/Order/OrderFormAllatM";
export default{
	name: 'OrderForm'
	,props: ['Axios', 'cart_items', 'member_info', 'TOKEN', 'rules', 'user']
	,components: {OrderFormAllatM, OrderFormReappay, Modal, DaumPost, OrderFormAllat }
	,data: function(){
		return {
			program: {
				name: '주문하기'
				,top: false
				,title: true
				,bottom: false
			}
			,daumPostUp: false
			,order_number: ''
			,item: {
				pay_div: 'card'
				,member_tell: this.member_info.member_tell ? this.member_info.member_tell : ''
				,member_email: this.member_info.member_email ? this.member_info.member_email : ''
				,d_name: ''
				,d_tell: ''
				,d_post: ''
				,d_addr1: ''
				,d_addr2: ''
				,site_bank: ''
				,bank_info: ''
				,c_uid: []
				,is_base: '0'
				,shipping_uid: 'new'
				,order_number: ''
				, pg_uid: ''
				, delivery_type: 'D002001'
			}
			,shop_info: {

			}
			,buy_items: [

			]
			,use_item: [

			]
			,is_modal: false
			,modal_option: {
				title: '배송지 목록'
				,top: true
				,bottom: false
			}
			,shipping_list: [

			]
			,is_island_delivery: false
			, pg_list: []
			, pg_info: {}
			, is_order: false
			, is_mobile: this.$common.isMobile()
		}
	}
	,computed: {
		order_price: function(){
			let price = 0
			price = this.total_price + this.total_delivery_price
			return price
		}
		, is_reappay: function(){
			let t = false
			if(this.pg_info.pg_code == 'reappay' && this.is_order){
				t = true
			}
			return t
		}
		, is_allat: function(){
			let t = false
			if(this.pg_info.pg_code == 'allat' && this.is_order){
				t = true
			}
			return t
		}
		,total_price: function(){
			let price = 0;

			for(let i = 0; i < this.use_item.length; i ++){
				if(!this.use_item[i].is_not_select) {
					price += (Number(this.use_item[i].pdt_price) + Number(this.use_item[i].op_price)) * this.use_item[i].op_cnt
				}
			}

			return price
		}
		,order_point: function(){
			let point = 0
			return point
		}
		,total_delivery_price: function(){
			let price = 0

			if(Object.keys(this.item_list).length > 0){
				for(const [key, val] of Object.entries(this.item_list)){
					if(!key){
						continue
					}
					price += Number(val.company.delivery_price)
					if (this.is_island_delivery) {
						price += Number(val.company.island_price)
					}
				}
			}

			return price
		}
		,order_item: function(){
			let item = this.item
			item.pay_div = this.item.pay_div
			item.total_price = this.total_price
			item.order_price = this.order_price
			item.order_point = this.order_point
			item.delivery_price = this.total_delivery_price
			item.site_bank = this.shop_info.bank_info
			item.c_uid = []
			item.order_number = this.item.order_number
			item.member_name = this.user.member_name
			item.member_email = this.item.member_email
			item.pg_uid = this.pg_info.uid
			item.pg_info = JSON.stringify(this.pg_info)

			let pdt_name = ''
			let pdt_code = ''
			if(Object.keys(this.item_list).length > 0) {
				for(const [key, val] of Object.entries(this.use_item)) {
					if(!key){
						continue
					}
					if(val.is_not_select){
						continue
					}
					pdt_name = val.pdt_name
					pdt_code = val.pdt_code
					item.c_uid.push(val.uid)
				}
			}

			item.pdt_name = pdt_name
			item.pdt_code = pdt_code

			item.c_uid = JSON.stringify(item.c_uid)

			return item
		}
		,item_list: function(){
			let items = {}

			for(const [key ,val] of Object.entries(this.use_item)){
				if(!key){
					continue
				}
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
				items[val.seller_id]['company']['island_price'] = val.delivery_add_price

				if(val.delivery_type == '0'){
					items[val.seller_id]['company']['delivery_price'] = 0
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
						odt_uid: val.uid
						,odt: val.op_name
						,odt_cnt: val.op_cnt
						,odt_price: Number(val.pdt_price) + Number(val.op_price)
						,cart_index: key
						,is_not_select: val.is_not_select
					}
				}

				if(val.is_sold == 1 || (val.is_sold == 2 && val.pdt_stock < 1)){
					option.is_sold = true
					option.is_not_select = true
				}

				items[val.seller_id]['items'][val.pdt_uid]['options'][val.uid] = option
			}

			return items
		}
	}
	,methods: {

		save: async function(){
			this.$bus.$emit('on', true)
			try{
				const result = await this.Axios({
					method: 'post'
					,url: 'order/postCartOrder'
					,data: this.order_item
				})

				if(result.success){
					this.order_number_new = result.data.order_number_new
					if(this.item.pay_div == 'bank'){
						this.$bus.$emit('notify', { type: 'success', message: result.message})
						this.toResult()
					}else{
						this.is_order = true
						this.$bus.$emit('on', true)
					}

				}else{
					throw result.message
					//await this.toCancel(this.order_number_new)
				}
			}catch (e) {
				console.log(e)
				// await this.toCancel(this.order_number_new)
				this.$bus.$emit('notify', { type: 'error', message: e})
				this.is_order = false
				this.$bus.$emit('on', false)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,daumPost: function (type) {
			this.$emit('setOverlay')
			this.daumPostUp = true
			this.daumPostType = type
		}
		, addPost: function (call) {

			this.$set(this.item, 'd_post', call.zonecode)
			this.$set(this.item, 'd_addr1', call.address)

			this.daumPostUp = false
			this.$emit('setOverlay')
		}
		,toResult: function(){
			this.$router.push({ name: 'OrderResult', params: { order_num_new: this.order_number_new }})
		}
		,getBuyItem: async function(){
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'order/getBuyItem'
					,data: {
						TOKEN: sessionStorage.getItem(process.env.VUE_APP_NAME + 'T')
					}
				})

				if(result.success){
					this.use_item = result.data.result
					if(this.use_item.length <= 0){
						throw '주문 가능한 상품이 없습니다.'
					}
				}else{
					throw result.message
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: e})
				this.$router.back()
			}
		}
		,getShippingList: async function(){
			try {
				const result = await this.Axios({
					method: 'post'
					,url: 'member/getShippingList'
					,data: {
					}
				})
				if(result.success){
					this.shipping_list = result.data
					if(this.shipping_list.length > 0){
						this.item.shipping_name = result.data[0].shipping_name
						this.item.d_name = result.data[0].name
						this.item.d_tell = result.data[0].tell
						this.item.d_post = result.data[0].post
						this.item.d_addr1 = result.data[0].addr1
						this.item.d_addr2 = result.data[0].addr2
						this.item.shipping_uid = result.data[0].uid
					}
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}
		}
		,showSipping: function(){
			this.is_modal = true
		}
		,setShipping: function(shipping) {

			this.item.shipping_uid = shipping.uid
			this.item.shipping_name = shipping.shipping_name
			this.item.d_name = shipping.name
			this.item.d_tell = shipping.tell
			this.item.d_post = shipping.post
			this.item.d_addr1 = shipping.addr1
			this.item.d_addr2 = shipping.addr2
			this.item.is_base = shipping.is_base

			this.is_modal = false
		}

		,getShopInfo: async function(){
			try {
				const result = await this.Axios({
					method: 'post'
					,url: 'order/getShopInfo'
					,data: {
					}
				})
				if(result.success){
					this.shop_info = result.data
					if(this.shop_info.is_bank != '1'){
						this.item.pay_div = 'card'
					}
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
					this.$router.back()
				}
			}catch (e) {
				console.log(e)
			}
		}
		,getIslandDelivery: async function(post){

			let supply = []
			for(let key in this.item_list){
				supply.push(key)
			}

			try {
				const result = await this.Axios({
					method: 'get'
					,url: 'order/getIslandDelivery'
					,data: {
						post: post
						,supply: supply
					}
				})
				if(result.success){
					this.is_island_delivery = result.data.is_island_delivery
					if(result.data.is_island_delivery){
						this.$bus.$emit('notify', { type: 'success', message: result.message})
					}
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}
		}

		, setPg: function(){

		}
		, getPgInfo: async function(){
			try {
				this.$bus.$emit('on', true)
				const result = await this.Axios({
					method: 'get'
					,url: 'order/getPgInfo'
					,data: {
					}
				})
				if(result.success){
					this.pg_info = result.data
					await this.save()
				}else{
					throw result.message
				}
			}catch (e) {
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: e})
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		, getPgList: async function(){

			try {
				this.$bus.$emit('on', true)
				const result = await this.Axios({
					method: 'get'
					,url: 'order/getPgList'
					,data: {
					}
				})
				if(result.success){
					this.pg_list = result.data
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		, getOrderNumber: async function(){

			try {
				this.$bus.$emit('on', true)
				const result = await this.Axios({
					method: 'get'
					,url: 'order/getOrderNumber'
					,data: {
					}
				})
				if(result.success){
					this.$set(this.item, 'order_number', result.data)
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,do: async function(){
			await this.getShopInfo()
			await this.getShippingList()

			if(this.$route.name == 'OrderBuy'){
				await this.getBuyItem()
			}else{
				this.use_item = this.cart_items
				if(this.use_item.length <= 0){
					this.$bus.$emit('notify', { type: 'error', message: '주문 가능한 상품이 없습니다.'})
					this.$router.back()
				}
			}

			await this.getOrderNumber()
		}
		,setNotify: function({ type, message}){
			this.$bus.$emit('notify', { type: type, message: message})
		}
		,success: function(){
			this.update()
		}
		,fail: function(){
			this.do()
			this.$bus.$emit('notify', { type: 'error', message: '결제가 정상적으로 처리되지 않았습니다. 잠시후 다시 이용해주세요'})
		}
		, update: async function(){
			try {
				this.$bus.$emit('on', true)
				const result = await this.Axios({
					method: 'post'
					,url: 'order/postUpdateOrder'
					,data: {
						order_number: this.item.order_number
					}
				})
				if(result.success){
					this.toResult()
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}

		, toPayment: function(){
			if(this.item.pay_div == 'bank'){
				this.save()
			}else if(this.item.pay_div == 'card'){
				this.is_reappay = true
			}
		}
		,doPaymentCard: function(){
			this.item.pay_div = 'card'
		}
		,toCancel: async function(){
			try {
				this.$bus.$emit('on', true)
				const result = await this.Axios({
					method: 'get'
					,url: 'order/postFailOrderCancel'
					,data: {
						order_number: this.item.order_number
					}
				})
				if(result.success){
					window.location.reload()
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		, checkPayment: function(){
			if(this.item.pay_div == 'bank'){
				this.save()
			}else{
				this.getPgInfo()
			}
		}
	}
	,created: function(){
		this.$emit('onLoad', this.program)

		this.do()
	}
	,watch: {
		'item.d_post':{
			handler: function(call){
				this.getIslandDelivery(call)
			}
		}
	}
}
</script>

<style>

.pdt-cnt {
	padding: 10px;
}
.box-pdt-cnt {
}

.box-pdt-cnt > button {
	border: 1px solid #ddd;
	width: 100%;
	font-size: 20px;
}
.box-pdt-cnt > input {
	border: none;
	border-top: 1px solid #ddd;
	border-bottom: 1px solid #ddd;
	padding: 0px 5px;
	width: 100%;
	text-align: center;
}

.odt-img {
	margin-right: 10px
}
.odt-img img {width: 100% !important;}
</style>