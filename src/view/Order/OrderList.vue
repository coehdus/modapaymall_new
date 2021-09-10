<template>
	<div
		class="full-height flex-column "
	>
		<div class="tab justify-space-between under-line">
			<div
				class="flex-1 pa-10 text-center "
				:class="{ on: search.type == ''}"
				@click="getTypeData('')"
			>주문전체</div>
			<div
				class="flex-1 pa-10 text-center box-rl"
				:class="{ on: search.type == 'order'}"
				@click="getTypeData('order')"
			>주문완료</div>
			<div
				class="flex-1 pa-10 text-center "
				:class="{ on: search.type == 'cancel'}"
				@click="getTypeData('cancel')"
			>주문취소</div>
		</div>

		<div
			class=" flex-column full-height pb-30 bg-gray-light overflow-y-auto"
		>
			<ul>
				<!-- 주문 내역-->
				<li
					v-for="(item, index) in item_list"
					:key="item.uid"
					class=" bg-white mt-10 box-shadow position-relative"
				>
					<!-- 주문일자 및 주문상세 이동 -->
					<div

						class="pa-10 justify-space-between "
						@click="toResult(item.order_num_new)"
					>
						<span class="">{{ item.wDate | transDate }}</span>
						<v-icon class="">mdi mdi-arrow-right-bold-box-outline</v-icon>
					</div>

					<div
						class=""
					>
						<div
							v-if="false"
							class="justify-space-between under-line-dashed pa-10"
						>
							<span>
								<span
									class="box pa-5"
									:class="'color-' + item.o_status_color"
								>{{ item.o_status_name }}</span>
							</span>
							<span class="color-blue">{{ item.order_price | makeComma }} 원</span>
						</div>

						<ul
							class="pa-10"
						>
							<li
								v-for="odt in item.odt_list"
								:key="'odt_' + odt.uid"
								class="pa-10 box mb-10 radius-10"
							>
								<div class="under-line-dashed pb-10 justify-space-between">
									<button
										class="box prl-10 size-px-11"
										:class="'color-' + odt.order_status_color"
									>{{ odt.order_status_name }}</button>
									<button
										v-if="odt.is_confirm"
										class="box prl-10 size-px-11 bg-green "
										@click="isConfirm(odt)"
									>구매 확정 <v-icon small class="color-eee">mdi mdi-chevron-right</v-icon></button>
								</div>
								<div
									class="justify-space-between ptb-10 under-line-dashed"
								>
									<span class="flex-1 pdt-img mr-10 flex-column justify-center">
										<img
											v-if="odt.pdt_img"
											:src="odt.pdt_img"
										/>
										<v-icon
											v-else
										>mdi mdi-image</v-icon>
									</span>
									<div class="flex-3">
										<div>{{ odt.pdt_name}} <span class="color-gray size-em-09">선택 옵션: {{ odt.op_name }}</span></div>
										<div class="mt-5 ">
											<span class="font-weight-bold">{{ odt.odt_price | makeComma }} 원</span>
											<span class="size-em-09"> 수량: {{ odt.op_cnt }}개</span>
										</div>
									</div>
								</div>
								<div class="mt-10  ">

									<button
										v-if="odt.is_cancel"
										class="box prl-10 size-px-11 bg-red "
										@click="isCancel(odt)"
									>교환 / 반품 <v-icon small class="color-eee">mdi mdi-chevron-right</v-icon></button>

								</div>
							</li>
						</ul>
						<div
							v-if="false"
							class="pa-10 text-right"
						>
							<button
								v-if="item.is_cancel"
								class="btn-danger size-px-12 prl-10"
								@click="viewCancel(item, index)"
							>결제 취소 요청 <v-icon small class="color-eee">mdi mdi-chevron-right</v-icon></button>
						</div>
					</div>
				</li>
			</ul>
			<Pagination
				:program="program"
				:align="'center'"
				:options="search"
				type="more"

				@click="getData"

				class="mt-10"
			></Pagination>
		</div>
		<Modal
			:is_modal="is_modal"
			:option="modal_option"

			@click="toCancel"
			@close="is_modal = !is_modal"
		>
			<div
				slot="modal-bottom"
				class="justify-space-between"
			>
				<button
					class="btn btn-danger"
					@click="toCancel"
				>주문 취소</button>
			</div>
		</Modal>

		<OrderDetail
			v-if="item.uid"
		></OrderDetail>

		<OrderCancel
			v-if="item_cancel.uid"
			:Axios="Axios"
			:item="item_cancel"
			:TOKEN="TOKEN"

			@click="clearItem"
			@setReason="setReason"
			@setCancelFile="setCancelFile"
			@setNotify="setNotify"
			@cancel="cancel"
			@onLoading="onLoading"
			@offLoading="offLoading"
		></OrderCancel>

		<OrderConfirm
			v-if="item_confirm.uid"
			:Axios="Axios"
			:item="item_confirm"
			:TOKEN="TOKEN"

			@click="clearItem"
			@setReason="setReason"
			@setCancelFile="setCancelFile"
			@setNotify="setNotify"
			@confirm="confirm"
			@onLoading="onLoading"
			@offLoading="offLoading"
		></OrderConfirm>
	</div>
</template>

<script>
	import Modal from "@/components/Modal";
	import Pagination from "../../components/Pagination";
	import OrderDetail from "@/view/Order/OrderDetail";
	import OrderCancel from "@/view/Order/OrderCancel";
	import OrderConfirm from "@/view/Order/OrderConfirm";
	export default{
		name: 'OrderList'
		,
		components: {OrderConfirm, OrderCancel, OrderDetail, Pagination, Modal},
		props: ['Axios', 'member_info', 'TOKEN', 'codes']
		,data: function() {
			return {
				program: {
					name: '주문내역'
					, top: false
					, title: true
					, bottom: true
				}
				,search: {
					TOKEN: this.TOKEN
					,sDate: ''
					,eDate: ''
					,type: this.$route.params.type
				}
				,items: [

				]
				,is_modal: false
				,modal_option: {
					top: true
					,title: '주문 취소'
					,content: '해당 주문을 취소하시겠습니까?'
					,bottom: true
				}
				,cancel_item: ''
				,item: {

				}
				,item_cancel: {

				}
				,item_confirm: {

				}
			}
		}

		,computed: {
			item_list: function(){
				const self = this
				return this.items.filter(function(item){
					item.TOKEN = self.TOKEN
					item.is_cancel = true

					switch (item.o_status){
						default: case "1":
							item.o_status_name = "입금 대기"
							item.o_status_color = "gray"
							break;

						case "2":
							item.o_status_name = "결제완료"
							item.o_status_color = "green"
							break
						case "3":
							item.o_status_name = "취소 요청"
							item.o_status_color = "orange"
							item.is_cancel = false
							break
						case "4":
							item.o_status_name = "주문 취소"
							item.o_status_color = "red"
							item.is_cancel = false
							break;
					}
					item.odt_list.filter(function(odt){
						odt.odt_price = Number(odt.pdt_price) + Number(odt.op_price)
						if(odt.pdt_img){
							odt.pdt_img = self.codes.img_url + odt.pdt_img
						}
						switch (odt.order_status){
							default: case 'step1':
								odt.order_status_name = '주문접수'
								odt.order_status_color = ''
								break
							case 'step2':
								odt.order_status_name = '배송준비중'
								odt.order_status_color = ''
								item.is_cancel = false
								break
							case 'step3':
								odt.order_status_name = '배송중'
								odt.order_status_color = 'blue'
								item.is_cancel = false
								break
							case 'step4':
								odt.order_status_name = '배송완료'
								odt.order_status_color = 'green'
								odt.is_cancel = true
								odt.is_confirm = true
								item.is_cancel = false
								break
							case 'step5':
								odt.order_status_name = '구매확정'
								odt.order_status_color = 'green'
								item.is_cancel = false
								break
							case 'step21':
								odt.order_status_name = '주문 취소 요청'
								odt.order_status_color = 'orange'
								item.is_cancel = false
								break
							case 'step22':
								odt.order_status_name = '주문 취소 완료'
								odt.order_status_color = 'red'
								item.is_cancel = false
								break
							case 'step31':
								odt.order_status_name = '교환 요청'
								odt.order_status_color = 'orange'
								item.is_cancel = false
								break
							case 'step32':
								odt.order_status_name = '교환 처리중'
								odt.order_status_color = 'orange'
								item.is_cancel = false
								break
							case 'step33':
								odt.order_status_name = '교환 배송중'
								odt.order_status_color = 'blue'
								item.is_cancel = false
								break
							case 'step34':
								odt.order_status_name = '교환 완료'
								odt.order_status_color = 'green'
								item.is_cancel = false
								break
							case 'step41':
								odt.order_status_name = '반품 요청'
								odt.order_status_color = 'orange'
								item.is_cancel = false
								break
							case 'step42':
								odt.order_status_name = '반품 처리중'
								odt.order_status_color = 'orange'
								item.is_cancel = false
								break
							case 'step43':
								odt.order_status_name = '반품 완료'
								odt.order_status_color = 'red'
								item.is_cancel = false
								break
						}
					})
					return item
				})
			}
		}
		,methods: {
			getData: async function(){
				try{
					const result = await this.Axios({
						method: 'get'
						,url: 'order/getOrderList'
						,data: this.search
					})

					if(result.success){
						let item = this.items
						this.items = item.concat(result.data.result)
						this.$set(this.search, 'total_count', result.data.tCnt)
						this.$emit('setNotify', { type: 'success', message: result.message })
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch(e){
					console.log(e)
				}
			}
			,toResult: function(order_number){
				this.$router.push({ name: 'OrderResult', params: { order_number: order_number }})
			}
			,viewCancel: function(item, index){
				this.is_modal = true
				item.index = index
				this.cancel_item = item

				console.log(item)
			}
			,toCancel: async  function(){

				console.log(this.cancel_item)
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'order/postOrderCancel'
						,data: this.cancel_item
					})

					if(result.success){
						this.$set(this.items[this.cancel_item.index], 'o_status', result.data.item.o_status)
						this.is_modal = false
						this.$emit('setNotify', { type: 'success', message: result.message})
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message})
					}
				}catch (e) {
					console.log(e)
				}
			}
			,getTypeData: function(type){
				this.items = []
				this.search.type = type
				this.$set(this.search, 'page', 1)
				this.getData()
			}
			,isCancel: function(odt){
				this.item_cancel = odt
			}
			,clearItem: function(){
				this.item = {}
				this.item_cancel = {}
				this.item_confirm = {}
			}
			,setReason: function(reason){
				this.$set(this.item_cancel, 'reason', reason)
			}
			,setCancelFile: function(e){
				console.log(e)
				let file = e.data.files[0]

				this.$set(this.item_cancel, 'img', file)
			}
			,isConfirm: function(odt){
				this.item_confirm = odt
			}
			,setNotify: function({ type, message }){
				this.$emit('setNotify', { type: type, message: message})
			}
			,confirm: function(){
				this.$set(this.item_confirm, 'order_status', 'step5')
				this.clearItem()
			}
			,cancel: function(step) {
				this.$set(this.item_confirm, 'order_status', step)
				this.clearItem()
			}
			,onLoading: function(){
				this.$emit('onLoading')
			}
			,offLoading: function(){
				this.$emit('offLoading')
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.getData()
		}
		,watch: {

		}
	}
</script>
<style>
	.pdt-img img { width: 100% }

	.tab .on { background-color: #333; color: #bbb}
</style>