<template>
	<div
		class="full-height flex-column"
	>
		<div
			class="pa-10 full-height pb-30 overflow-y-auto  bg-gray-light">

			<template
				v-if="cart_items.length > 0"
			>
			<ul>
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
								<span
									v-else
								>No Image</span>
							</div>
							<div class="flex-3">
								<div class=" ptb-10 under-line font-weight-bold">{{ product.pdt_name }}</div>
								<div
									v-for="(option, index) in product.options"
									:key="'odt_' + index"
									class=" pa-10 under-line-dashed"
								>
									<div
										class="mt-10 justify-space-between"
									>
										<span
											class="size-px-13"
											@click="setCartOptionSelect(option, option.odt_uid)"
										>
											<v-icon
												v-if="option.is_not_select"
												class="size-px-16"
											>mdi-checkbox-blank-outline</v-icon>
											<v-icon
												v-else
												class="color-green size-px-16"
											>mdi mdi-checkbox-marked</v-icon>
											<span class="ml-5 color-gray"> {{ option.odt }}</span>
										</span>
										<span>
											<v-icon
												small
												class="color-red btn-remove-cart"
												@click="removeCart(option.cart_index, option.odt_uid)"
											>mdi mdi-close</v-icon>
										</span>
									</div>
									<div
										class="mt-10 justify-space-between"
									>
										<span
											class="flex-1 color-blue"
										>{{ option.odt_price | makeComma }} 원</span>

										<div
											v-if="option.is_sold"
										>품절</div>
										<span
											v-else
											class="flex-1 flex-row justify-space-between box-pdt-cnt"
										>
											<button
												@click="setCnt(option, 'down')"
												class="flex-1 mdi mdi-minus size-px-14"
											></button>
											<input
												v-model="option.odt_cnt"
												type="number"
												name="pdt_cnt"
												class="flex-2 bg-gray-light"
												readonly
											/>
											<button
												@click="setCnt(option, 'up')"
												class="flex-1 mdi mdi-plus size-px-14"
											></button>
										</span>
									</div>
									<div
										v-if="false"
										class="mt-10 justify-space-between"
									>
										<div>개별 상품 배송비</div>
										<div>{{ product.pdt_delivery | makeComma }} 원</div>

									</div>
								</div>

							</div>
						</li>
					</ul>
					<div
						class="pa-10 justify-space-between under-line-dashed"
					>
						<span>배송비 <br/><span class="size-px-11">{{ item.company.delivery }}</span></span>
						<span>{{ Number(item.company.delivery_price) + Number(item.company.pdt_delivery_price) | makeComma }}</span>
					</div>
					<div
						class="pa-10 justify-space-between"
					>
						<span>합계</span>
						<span class="color-blue">{{ item.company.total_price | makeComma }} 원</span>
					</div>
				</li>
			</ul>
			</template>
			<Empty
				v-else
			></Empty>
		</div>


		<div
			class="mt-auto flex-column box-shadow position-relative"
		>
			<div>
				<div
					class="pa-10 justify-space-between under-line-dashed"
				>
					<span>배송비 </span>
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
					@click="toOrder"
				>주문하기</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Empty from "@/view/Layout/Empty";
	export default{
		name: 'Cart'
		,
		components: {Empty},
		props: ['Axios', 'cart_items', 'filter', 'TOKEN']
		,data: function(){
			return {
				program: {
					name: '장바구니'
					,top: false
					,title: true
					,bottom: false
				}
				//,total_delivery_price: 0
			}
		}
		,computed: {
			total_price: function(){
				let price = 0;

				if(this.cart_items.length > 0) {
					for (let i = 0; i < this.cart_items.length; i++) {
						if (!this.cart_items[i].is_not_select) {
							price += (Number(this.cart_items[i].pdt_price) + Number(this.cart_items[i].op_price)) * this.cart_items[i].op_cnt
							//price += Number(this.cart_items[i].pdt_delivery)
						}
					}
				}

				return price;
			}
			,total_delivery_price: function(){
				let price = 0

				if(Object.keys(this.item_list).length > 0){
					for(const [key, val] of Object.entries(this.item_list)){
						console.log(key)
						price += Number(val.company.delivery_price)
						//price += Number(val.company.pdt_delivery_price)
					}
				}

				return price
			}
			,is_cart_select: function(){
				let result = false

				if(Object.keys(this.item_list).length > 0){
					for(const [key, val] of Object.entries(this.cart_items)){
						console.log('is_select_cart : ' + key)
						if(!val.is_not_select){
							result = true
							break
						}
					}
				}
				return result
			}
			,item_list: function(){
				let items = {}

				for(const [key ,val] of Object.entries(this.cart_items)){
					console.log('key: ' + key)

					let company = items[val.seller_id]

					if(!company){
						company = {
							company: {
								total_price: 0
								,pdt_delivery_price: 0
							}
							,items: {}
						}
					}

					items[val.seller_id] = company

					items[val.seller_id]['company']['seller_id'] = val.seller_id
					items[val.seller_id]['company']['seller_name'] = val.shop_name
					if(!val.is_not_select) {
						items[val.seller_id]['company']['total_price'] += ((Number(val.pdt_price) + Number(val.op_price)) * val.op_cnt)
					}
					items[val.seller_id]['company']['delivery_type'] = val.delivery_type
					items[val.seller_id]['company']['delivery_price'] = val.delivery_price

					// items[val.seller_id]['company']['pdt_delivery_price'] += (Number(val.pdt_delivery) * val.op_cnt)

					if (val.delivery_type == '0') {
						items[val.seller_id]['company']['delivery_price'] = val.delivery_type
						items[val.seller_id]['company']['delivery'] = ''
					} else {
						if (val.free_price > 0) {
							items[val.seller_id]['company']['delivery'] = val.free_price + ' 이상 구매시 무료'
							if (val.free_price <= items[val.seller_id]['company']['total_price'] || items[val.seller_id]['company']['total_price'] == 0) {
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
							,pdt_delivery: val.pdt_delivery
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

						this.setCartOptionSelect(option)
					}

					items[val.seller_id]['items'][val.pdt_uid]['options'][val.uid] = option
				}

				return items
			}
		}
		,methods: {
			removeCart: async function(cart_index, odt_uid){
				if(confirm('해당 상품을 삭제하시겠습니까?')){
					this.$bus.$emit('on', true)
					try{
						const result = await this.Axios({
							method: 'post'
							,url: 'order/postDeleteCartItem'
							,data: {
								odt_uid: odt_uid
							}
						})

						if(result.success){
							this.$bus.$emit('notify', { type: 'success', message: result.message })
							this.$delete(this.cart_items, cart_index)
						}else{
							this.$bus.$emit('notify', { type: 'error', message: result.message })
						}
					}catch(e){
						console.log(e)
					}finally {
						this.$bus.$emit('on', false)
					}
				}
			}

			,setCnt: async function(odt, type){
				let cnt = odt.odt_cnt
				if(cnt == ''){
					cnt = 1
				}
				if(type == 'up'){
					if(cnt >= 99){
						cnt = 99
					}else{
						cnt = Number(cnt) + 1
					}
				}else{
					if(cnt <= 1){
						cnt = 1
						return false
					}else{
						cnt = Number(cnt) - 1
					}
				}

				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'order/postOdtCnt'
						,data: {
							c_uid: odt.odt_uid
							,op_cnt: cnt
						}
					})

					if(!result.success){
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}finally {
					this.$emit('getCartList')
				}
			}
			,toOrder: function(){
				if(!this.is_cart_select){
					this.$bus.$emit('notify', { type: 'error', message: '선택된 상품이 없습니다.'})
				}else {

					this.$router.push({name: 'OrderForm'})
				}
			}
			,setCartOptionSelect: function(option){

				let val = !this.cart_items[option.cart_index].is_not_select ? true : false

				if(option.is_sold){
					val = true
				}

				this.$set(this.cart_items[option.cart_index], 'is_not_select', val)
			}
		}
		,created: function(){
			this.$emit('onLoad', this.program)
			this.$emit('getCartList')
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

.btn-remove-cart{
	border: 1px solid #ddd; font-size: 12px; padding: 0px 3px
}
</style>