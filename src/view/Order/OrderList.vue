<template>
	<div
		class="full-height flex-column "
	>
		<div class="tab justify-space-between under-line">
			<div
				class="flex-1 pa-10 text-center "
				:class="{ on: search.type == 'all'}"
				@click="getTypeData('all')"
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
						@click="toDetail(item)"
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
										class="font-weight-bold"
										:class="'color-' + odt.order_status_color"
									>{{ odt.order_status_name }}</button>
									<button
										v-if="odt.is_shipping"
										class="box prl-10 size-px-11 ml-5 color-blue"
										@click="toShipping(odt)"
									>배송조회 <v-icon small >mdi mdi-chevron-right</v-icon></button>
								</div>
								<div
									class="justify-space-between ptb-10 "
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
								<div
									class="mt-10  under-line-dashed pb-10"
								>
									<button
										v-if="odt.is_cancel"
										class="box prl-10 size-px-11 bg-red "
										@click="isOdtUpdate(odt, odt_step_cancel)"
									>주문취소 <v-icon small class="color-eee">mdi mdi-chevron-right</v-icon></button>

									<button
										v-if="odt.is_confirm"
										class="box prl-10 size-px-11 bg-green mr-5"
										@click="toOdtConfirm(odt)"
									>구매확정 <v-icon small class="color-eee">mdi mdi-chevron-right</v-icon></button>

									<button
										v-if="odt.is_return"
										class="box prl-10 size-px-11 bg-orange mr-5 "
										@click="toOdtReturn(odt)"
									>교환/반품<v-icon small class="color-eee">mdi mdi-chevron-right</v-icon></button>

								</div>
							</li>
						</ul>
						<div class="pa-10 top-line justify-space-between ">
							<span class="font-weight-bold" :class="'color-' + item.o_status_color">{{ item.o_status_name }}</span>
							<span class="font-weight-bold">결제 금액: {{ item.order_price | makeComma }} 원</span>
						</div>
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

				@click="toPage"

				class="mt-10"
			></Pagination>
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
					class="btn btn-danger"
					@click="toOdtCancel"
				>확인</button>
				<button
					class="btn btn-default"
					@click="clearItem"
				>닫기</button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import Modal from "@/components/Modal";
	import Pagination from "../../components/Pagination";

	export default{
		name: 'OrderList'
		,
		components: { Pagination, Modal},
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
					,page: this.$route.params.page
					, list_cnt: 10
				}
				,items: [

				]
				,is_modal: false
				,modal_option: {
					top: true
					,title: '주문취소'
					,content: '해당 주문상품을 취소하시겠습니까?'
					,bottom: true
				}
				,cancel_item: ''
				,item: {

				}
				,odt_step_confirm: 'step5'
				,odt_step_cancel: 'step21'
				,odt_step_change: 'step31'
				,odt_step_return: 'step41'
				,item_cancel: {

				}
				,item_return: {

				}
				,item_confirm: {

				}
				,item_result: {

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
							item.o_status_name = "결제대기"
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
							item.o_status_name = "결제취소"
							item.o_status_color = "red"
							item.is_cancel = false
							break;
					}
					item.odt_list.filter(function(odt){
						odt.odt_price = Number(odt.pdt_price) + Number(odt.op_price)
						if(odt.pdt_img){
							odt.pdt_img = self.codes.img_url + odt.pdt_img
						}
						odt.is_shipping = true

						switch (odt.order_status){
							default: case 'step1':
								odt.is_shipping = false
								odt.is_cancel = true
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
					})
					return item
				})
			}
		}
		,methods: {
			getData: async function(){
				this.$emit('onLoading')
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
				}finally {
					this.$emit('offLoading')
				}
			}
			,toDetail: function(item){
				this.$router.push({ name: 'OrderDetail', params: {order_num_new: item.order_num_new}})
			}
			,viewCancel: function(item, index){
				this.is_modal = true
				item.index = index
				this.cancel_item = item

				console.log(item)
			}
			,toOdtCancel: async function(){
				this.$emit('onLoading')
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'order/postOdtUpdate'
						,data: {
							uid: this.item_cancel.uid
							,TOKEN: this.TOKEN
							,next_step: this.odt_step_cancel
						}
					})

					if(result.success){
						this.$router.go(this.$router.currentRoute)
						this.$emit('setNotify', { type: 'success', message: result.message})
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message})
					}
				}catch (e) {
					console.log(e)
				}finally {
					this.$emit('offLoad')
				}
			}
			,toOrderCancel: async function(){

				this.$emit('onLoading')
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
				}finally {
					this.$emit('offLoad')
				}
			}
			,getTypeData: function(type){
				this.$router.push({ name: 'OrderList', params: { type: type}})
			}
			,isCancel: function(odt){
				this.item_cancel = odt
			}
			,isReturn: function(odt){
				this.item_return = odt
			}
			,clearItem: function(){
				this.is_modal = false
				this.item = {}
				this.item_cancel = {}
				this.item_return = {}
				this.item_confirm = {}
				this.item_result = {}
				this.$emit('offLoading')
			}
			,setReason: function(reason){
				this.$set(this.item_return, 'reason', reason)
			}
			,setCancelFile: function(e){
				console.log(e)
				let file = e.data.files[0]

				this.$set(this.item_return, 'img', file)
			}
			,isConfirm: function(odt){
				this.item_confirm = odt
				this.$router.push({ name: 'OdtConfirm', params: {odt_uid: odt.uid}})
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
			,toShipping: function(odt){
				let code = this.codes.G000.items
				let url = ''
				for(let i = 0; i < code.length; i++){
					if(code[i].total_code == odt.shipping_name){
						url = code[i].code_value + odt.shipping_num
						break
					}
				}
				console.log(url)
				window.open(url, 'shipping')
			}
			,toPage: function(page){
				this.$router.push({ name: 'OrderList', params: { type: this.search.type, page: page}})
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