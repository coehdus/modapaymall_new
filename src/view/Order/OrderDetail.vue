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

			<div
				class="mt-10"
			>

				<h6>배송 구분</h6>

				<div
					class="bg-white pa-10 box-shadow font-weight-bold"
				>
					{{ item.delivery_type == 'D002002' ? '방문 수령' : '택배 배송'}}
				</div>
			</div>

			<div
				v-if="item.delivery_type == 'D002002'"
				class="mt-10"
			>
				<div
					class="bg-white pa-10 box-shadow"
				>주문한 상품을 매장에 직접방문하여 수령합니다</div>
			</div>
			<div
				v-else
				class="mt-10"
			>

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

			<div class="mt-10 flex-row justify-space-between items-center">
				<h6>상품 정보</h6>
				<button
					v-if="is_purchase"
					class="btn-inline btn-primary"
					@click="onPurchase"
				>매입 처리</button>
				<button
					v-else-if="!is_purchase && item.is_purchase == 1"
					class="btn-inline btn-primary"
					@click="copy"
				>매입 코드</button>
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
								class="pa-10 under-line full-height "
							>
								<div
									class="justify-space-between under-line mb-10 pb-10"
								>
									<div
										class="flex-1 flex-column justify-center "
										:class="'color-' + odt.order_status_color"
									>{{ odt.order_status_name }}</div>

									<button
										v-if="odt.shipping_num"
										class="box prl-10 color-blue"
										@click="toShipping(odt)"
									>배송조회</button>
								</div>
								<div class="justify-space-between under-line-dashed pb-10 ">

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
										<div class="under-line-dashed">
											{{ odt.pdt_name }}
										</div>

										<div class="under-line-dashed  color-gray  ptb-5 mb-5">
											<span>선택옵션: </span>
											<span>{{ odt.op_name}}</span>
										</div>
										<div
											class="justify-space-between"
										>
											<span
												class="flex-2 font-weight-bold"
											>{{ odt.pdt_price | makeComma }} 원</span>

											<span>수량: {{ odt.op_cnt }} 개</span>
										</div>
									</div>
								</div>
								<div
									class="justify-space-between"
								>

									<div class="flex-3 mt-10 size-px-10 text-right">
										<span
											v-if="odt.is_cancel && (!item.is_purchase || item.is_purchase == '0')"
											class=" prl-10 bg-red"
											@click="isOdtUpdate(odt,'step21')"
										>주문 취소</span>
										<span
											v-if="odt.is_confirm"
											class="box prl-10 bg-green"
											@click="toOdtConfirm(odt)"
										>구매 확정</span>
										<span
											v-if="odt.is_return && (!item.is_purchase || item.is_purchase == '0')"
											class="box prl-10 bg-orange mr-5"
											@click="toOdtReturn(odt)"
										>교환 / 반품</span>
									</div>
								</div>
								<div
									v-if="is_purchase"
									class="text-right mt-10 top-line-dashed pt-10"
								>
									<label
										v-if="item.is_purchase == 1"
										class="label label-primary"
									>매입 처리중</label>
									<label
										v-if="item.is_purchase == 2"
										class="label label-primary"
									>매입 완료</label>
								</div>
								<div
									v-if="odt.reason"
									class="top-line-dashed mt-10 pt-10"
								>
									<div>{{ odt.reason_name}}</div>
									<div>{{ odt.reason_text}}</div>
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
							class="pa-10 justify-space-between "
						>
							<span class="font-weight-bold">배송비 </span>
							<span class="font-weight-bold">{{ supply.delivery_price | makeComma }} 원</span>
						</div>
						<div
							v-if="supply.island_delivery > 0"
							class="mb-10 prl-10 justify-space-between "
						>
							<span class="font-weight-bold">도서산간 추가 배송비</span>
							<span class="font-weight-bold">{{ supply.island_delivery | makeComma }} 원</span>
						</div>
					</li>
				</ul>
			</template>

			<h6 class="mt-10">결제 정보</h6>
			<div
				class="pa-10 bg-white box-shadow font-weight-bold"
			>
				<div class=" mt-5  justify-space-between under-line-dashed">
					<span class="">결제 상태</span>
					<span :class="'color-' + item.o_status_color ">{{ order_status }}</span>
				</div>
				<div class=" justify-space-between under-line-dashed">
					<span class="font-weight-bold">결제금액</span>
					<span><span class="color-blue font-weight-bold">{{ item.order_price | makeComma }}</span> 원</span>
				</div>
				<div class=" mt-5  justify-space-between under-line-dashed">
					<span class="font-weight-bold">결제</span>
					<span>{{ pay_div }}</span>
				</div>
				<div class=" mt-5 text-right ">
					{{ item.pay_info }}
				</div>
			</div>
		</div>


		<Modal
			:is_modal="is_modal"
			:option="modal_option"

			@close="is_modal = !is_modal"
		>
			<div
				slot="modal-bottom"
				class="justify-space-between"
			>
				<button
					class="btn bg-red"
					@click="toOdtStatus"
				>확인</button>
				<button
					class="btn btn-default"
					@click="clearItem"
				>닫기</button>
			</div>
		</Modal>

		<PopupConfirm
			v-if="is_on_purchase"

			@cancel="is_on_purchase = false"
			@click="postPurchaseRequest"
		>

			<template
				v-slot:title
			>매입 요청</template>
			<template
				v-slot:main-txt
			>매입 요청 하시겠습니까?</template>
		</PopupConfirm>
	</div>
</template>

<script>
import Modal from "@/components/Modal";
import PopupConfirm from "../Layout/PopupConfirm";
export default {
	name: 'OrderResult'
	, components: {PopupConfirm, Modal}
	, props: ['Axios', 'codes', 'TOKEN', 'seller_info']
	, data: function(){
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
			,is_modal: false
			,modal_option: {
				top: true
				,title: '주문취소'
				,content: '해당 주문상품을 취소하시겠습니까?'
				,bottom: true
			}
			,odt_step_cancel: 'step21'
			,item_cancel: ''
			, is_on_purchase: false
			, is_purchase_request: false
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
		, is_purchase: function(){
			let t = false
			if(this.seller_info.sales_type == 1 && (!this.item.is_purchase || this.item.is_purchase == '0') && this.is_purchase_request){
				t = true
			}
			return t
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
			self.is_purchase_request = false
			return this.item.supply_list.filter(function(item){

				return item.odt_list.filter(function(odt){

					odt.options = {}
					if(odt.pdt_img1){
						odt.pdt_img = self.codes.img_url + odt.pdt_img1
					}
					switch(odt.order_status){
						default: case 'step1':
							odt.is_shipping = false
							odt.is_cancel = true
							self.is_purchase_request = true
							break
						case 'step2':
							odt.is_cancel = false
							odt.is_shipping = false

							item.is_cancel = false
							break
						case 'step3':

							item.is_cancel = false
							break
						case 'step4':
							odt.is_cancel = false
							odt.is_confirm = true
							odt.is_return = true

							item.is_cancel = false
							break
						case 'step5':

							item.is_cancel = false
							break
						case 'step21':
							odt.is_shipping = false

							item.is_step21 = false
							break
						case 'step22':
							odt.is_shipping = false

							//item.is_cancel = false
							break
						case 'step31':

							item.is_cancel = false
							break
						case 'step32':

							item.is_cancel = false
							break
						case 'step33':

							item.is_cancel = false
							break
						case 'step41':

							item.is_cancel = false
							break
						case 'step42':

							item.is_cancel = false
							break
						case 'step43':

							item.is_cancel = false
							break
					}

					return odt
				})
			})
		}
	}
	,methods:{
		getData: async function(){
			this.$bus.$emit('on', true)
			try{
				const result = await this.Axios({
					method: 'get'
					,url: 'order/getOrderDetail'
					,data: {
						order_num_new: this.$route.params.order_num_new
					}
				})

				if(result.success){
					this.item = result.data
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message })
				}
			}catch (e) {
				this.$bus.$emit('notify', { type: 'error', message: e})
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		,toShipping: function(odt){
			let code = this.codes.G000.items
			let url = ''
			for(let i = 0; i < code.length; i++){
				if(code[i].total_code == odt.shipping_name){
					url = code[i].code_value + odt.shipping_num
					break
				}
			}
			// console.log(url)
			window.open(url, 'shipping')
		}
		,toOdtStatus: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					, url: 'order/postOdtUpdate'
					, data: {
						uid: this.item_cancel.uid
						, next_step: this.odt_step_cancel
					}
				})

				if(result.success){
					this.$bus.$emit('notify', { type: 'success', message: result.message})
					this.clearItem()
					await this.getData()
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				this.$bus.$emit('notify', { type: 'error', message: e})
			}
		}
		,isOdtUpdate: function(odt, step){
			this.is_modal = true
			this.modal_option.type = step
			this.item_cancel = odt
		}
		,toOdtConfirm: function(odt){
			this.$router.push({ name: 'OdtConfirm', params: { odt_uid: odt.uid }})
		}
		,toOdtReturn: function(odt){
			this.$router.push({ name: 'OdtReturn', params: { odt_uid: odt.uid }})
		}
		,clearItem: function(){
			this.is_modal = false
			this.item = {
				supply_list: []
			}
			this.item_cancel = {}
			this.item_return = {}
			this.item_confirm = {}
			this.item_result = {}
			this.is_on_purchase = false
			this.$bus.$emit('on', false)
		}
		, postPurchaseRequest: async function(){
			try{
				const result = await this.Axios({
					method: 'post'
					, url: 'order/postPurchaseRequest'
					, data: {
						order_number: this.item.order_num_new
					}
				})

				if(result.success){
					this.$bus.$emit('notify', { type: 'success', message: result.message})
					await this.getData()
				}else{
					this.$bus.$emit('notify', { type: 'error', message: result.message})
				}
			}catch(e){
				this.$bus.$emit('notify', { type: 'error', message: e})
			}finally {
				this.is_on_purchase = false
			}
		}
		, onPurchase: function(){
			this.is_on_purchase = true
		}

		,clipBoard: function (value){
			const t = document.createElement("textarea");
			document.body.appendChild(t);
			t.value = value;
			t.select();
			document.execCommand('copy');
			document.body.removeChild(t);
		}

		,copy: function (){

			this.clipBoard(this.item.order_number);
			alert('매입코드가 복사되었습니다.');
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