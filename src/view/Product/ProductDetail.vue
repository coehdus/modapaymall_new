<template>
	<div
		class="full-height flex-column position-fixed  full-width bg-white"
		style="left: 0; top: 0; z-index: 999"
	>
		<div
			class="bg-title justify-space-between"
		>
			<button
				:title="program.name"
				@click="toBack"
			><v-icon class="">mdi-chevron-left</v-icon><span class=" font-weight-bold size-em-12 vertical-middle">{{ program.name }}</span></button>

			<span
				class=" ptb-5 flex-column "
				@click="toCart"
			>
				<v-icon class="mr-10">mdi mdi-cart-outline</v-icon>
				<span
					v-if="cart_cnt"
					class="cart-count"
				>{{ cart_cnt }}</span>
			</span>
		</div>
		<div
			class="mt-10 pa-10 full-height flex-column overflow-y-auto"
		>
			<div
				class="pdt-img1"
			>
				<div class=" flex-row justify-space-between">
					<v-icon
						@click="file_index--"
					>mdi mdi-chevron-left</v-icon>

					<div
						class="flex-column justify-center"
						style="text-align: center; min-width: 120px; min-height: 120px"
					>
						<template
							v-if="files.sub.length > 0"
						>
						<template
							v-for="(file, index) in files.sub"
						>
							<div
								v-show="file_index == index"
								:key="file.file_name"
							>
								<img
									:src="'http://delimall.co.kr/API/data/product/' + file.file_name" alt="main1"
								/>
							</div>
						</template>
						</template>
						<v-icon
							v-else
							class="full-height flex-column justify-center input-box"
						>mdi mdi-image</v-icon>
					</div>
					<v-icon
						@click="file_index++"
					>mdi mdi-chevron-right</v-icon>
				</div>
			</div>

			<div
				class="mt-20 flex-row justify-space-between"
			>
				<div
					class="pdt-rate"
				>평점</div>
				<div
					class="pdt-price"
				>{{  item.agency_sale_price | makeComma }} 원</div>
			</div>

			<div
				class="mt-10 justify-space-between"
			>
				<div>상품 개별 배송비</div>
				<div
					class="pdt-price"
				>{{ item.pdt_delivery | makeComma}} 원</div>
			</div>


			<div
				v-if="item.is_sold == 2"
				class="mt-10 flex-row justify-space-between"
			>
				<div
					class="pdt-price"
				><span v-if="item.pdt_stock < 10" class="color-red">품절임박</span></div>
				<div
					class="pdt-rate"
				>수량 {{ item.pdt_stock | makeComma }} 개</div>
			</div>

			<div
				class="pdt-pdt_options"
			>
				<div
					v-for="(pdt_option, index) in pdt_options"
					:key="'option_' + index"
					class="mt-10"
				>
					<select
						v-model="option[index]"
						class="select"
					>
						<option value="">{{ pdt_option.opt_name }}</option>
						<option
							v-for="opt in pdt_option.opt_cont.split(',')"
							:key="'option_' + index + '_' + opt"
							:value="pdt_option.opt_name + ' : ' + opt"
						>{{ opt }}</option>
					</select>
				</div>
			</div>

			<h6 class="mt-30">상세정보</h6>
			<div
				class="mt-10 input-box pdt-info"
			>
				<Viewer
					v-if="item.pdt_info"
					:initialValue="item.pdt_info"
				/>
				<div
					v-else
				>상품 정보가 없습니다</div>
			</div>

			<h6 class="mt-30">반품/교환정보</h6>
			<div
				class="mt-10 input-box pdt-notice"
			>
				<Viewer
					v-if="item.pdt_notice"
					:initialValue="item.pdt_notice"
				/>
				<div
					v-else
				>반폼/교환 정보가 없습니다</div>
			</div>

		</div>

		<div
			class="mt-auto pa-10 shadow-top position-relative"
		>
			<div
				v-if="options.length > 1"
				class="text-center"
				style="height: 10px;"
				@click="is_show_options = !is_show_options"
			>
				<v-icon
					v-if="is_show_options"
					class=" bg-white"
					style="border: 1px solid #ddd; margin-top: -50px"
				>mdi mdi-chevron-double-down</v-icon>
				<v-icon
					v-else
					class=" bg-white"
					style="border: 1px solid #ddd; margin-top: -50px"
				>mdi mdi-chevron-double-up</v-icon>
			</div>

			<!-- 선택 옵션 -->
			<ul
				v-show="is_show_options"
			>
				<li
					v-for="(odt, index) in odts"
					:key="'odt_' + index"
					class="pa-10 under-line-dashed"
				>
					<div
						class=" flex-row justify-space-between"
					>
						<span
							class="flex-2 color-black span-pdt-cnt size-px-11 mr-5"
						>{{ odt.odt }}</span>

						<span
							v-if="item.is_sold == 1 || (item.is_sold == 2 && item.pdt_stock < 1)"
							class=" color-red ml-10"
						>품절</span>
						<span
							v-else
							class="flex-1  flex-column justify-center"
						>
							<span class="justify-space-between box-pdt-cnt">
								<button
									@click="setCnt(odt, 'down')"
									class="flex-1 mdi mdi-minus"
								></button>
								<input
									v-model="odt.odt_cnt"
									type="number"
									name="pdt_cnt"
									class="flex-1 bg-gray-light"
									readonly
								/>
								<button
									@click="setCnt(odt, 'up')"
									class="flex-1 mdi mdi-plus"
									:class="{ 'mr-5': pdt_options.length}"
								></button>
								<button
									small
									v-if="pdt_options.length"
									@click="removeItem(index)"
									class="flex-1 color-red mdi mdi-close"
								></button>
							</span>
						</span>
					</div>
				</li>
			</ul>

			<div
				class="pdt-cnt flex-row justify-space-between"
			>
				<span
					class="font-weight-bold color-black"
				>총 상품가</span>
				<span
					class="order-price font-weight-bold color-black"
				>{{ total_price | makeComma }}</span>
			</div>
			<div
				class="mt-10 flex-row justify-space-between"
			>
				<button
					class="flex-1 btn btn-default mr-10"
					@click="setBuy"
				>바로구매</button>
				<button
					class="flex-1 btn btn-identify"
					@click="setCart"
				>장바구니</button>
			</div>
		</div>
		<Modal
			:option="modal_option"
			:is_modal="is_modal"
		>
			<div
				slot="modal-content"
				v-html="modal_option.content"
			></div>
			<template slot="modal-bottom">
				<div
					class="justify-space-between"
				>
					<button
						class="btn btn-blue"
						@click="toCart"
					>장바구니로 이동</button>
					<button
						class="btn btn-green"
						@click="toClose"
					>계속 쇼핑</button>
				</div>
			</template>
		</Modal>
	</div>
</template>

<script>

	import '@toast-ui/editor/dist/toastui-editor-viewer.css';
	import { Viewer } from "@toast-ui/vue-editor";

	import Modal from "@/components/Modal";
	export default {
		name: 'ProductDetail'
		,props: ['Axios', 'item', 'cart_cnt']
		,components: { Modal, Viewer}
		,data: function(){
			return {
				program: {
					name: this.item.pdt_name
					,top: false
					,title: false
					,bottom: false
				}
				// 상품옵션
				,pdt_options: null
				// 판매자 정보
				,seller_info: {
					
				}
				//장바구니
				,cart_items: [
					
				]
				,pdt_cnt: 1
				,files: {
					main: []
					,sub: []
				}

				,file_index: 0
				// 현재 옵션
				,option: []
				// 선택한 옵션
				,options: [

				]
				,is_show_options: true
				// 장바구니 이동 컨펌창
				,is_modal: false
				,modal_option: {
					top: true
					,title: '장바구니'
					,content: '장바구니에 등록되었습니다. 장바구니로 이동하시겠습니까?'
					,bottom: true
				}
			}
		}
		,computed: {
			total_price: function(){
				let price = 0
				let agency_sale_price = this.item.agency_sale_price
				this.options.forEach(function(item){
					price += Number(item.odt_cnt) * (Number(agency_sale_price) + Number(item.odt_price))
				})
				return price
			}
			,odts: function(){
				return this.options.filter(function(item){
					console.log(item)
					return item.odt.replaceAll(',', '/')
				})
			}
		}
		,methods: {
			getData: async function(){
				try{
					const result = await this.Axios({
						method: 'get'
						, url: 'product/getProduct'
						, data: {
							pdt_uid: this.item.uid
						}
					})

					if (result.success) {
						this.$set(this, 'pdt_options', result.data.pdt_options)

						this.resetOption(this.pdt_options)
						this.files = result.data.pdt_files
						this.seller_info = result.data.seller_info
					} else {
						this.$emit('setNotify', {type: 'error', message: result.message})
					}
				}catch(E){
					console.log(E)
				}
			}
			,setBuy: async function() {
				if(this.options.length <= 0){
					this.$emit('setNotify', { type: 'error', message: '옵션을 선택하세요'})
					return false
				}
				let item = this.item
				item.options = JSON.stringify(this.options)
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'order/postBuy'
						,data: item
					})

					if(result.success){
						await this.$router.push({ name: 'OrderBuy'})
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
					this.$emit('setNotify', { type: 'error', message: 'DB 오류'})
				}
			}

			,setCart: async function(){
				if(this.options.length <= 0){
					this.$emit('setNotify', { type: 'error', message: '옵션을 선택하세요'})
					return false
				}
				let item = this.item
				item.options = JSON.stringify(this.options)
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'order/postCart'
						,data: item
					})

					if(result.success){

						this.$emit('getCartList')
						this.resetOption(this.option)

						this.is_modal = true
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
					this.$emit('setNotify', { type: 'error', message: 'DB 오류'})
				}
			}
			,toBack: function(){
				this.$emit('click')
			}
			,toggleOption: function(option){
				this.$set(option, 'is_view', !option.is_view)
			}
			,setOption: function(option, opt){
				console.log(option)
				this.$set(option, 'opt', opt)
				this.toggleOption(option)
			}
			,resetOption: function(call){
				if(call.length > 0) {
					for (let i = 0; i < call.length; i++) {
						this.$set(this.option, i, '')
					}
				}else{
					this.$set(this.options, 0, {
						odt: this.item.pdt_name
						,odt_cnt: 1
						,odt_price: 0
						,pdt_stock: this.item.pdt_stock
					})
				}
			}
			,removeItem: function(index){
				if(confirm('해당 옵션을 삭제하시겠습니까?')){
					this.$delete(this.options, index)
				}
			}
			,toCart: function(){
				this.$emit('push', 'Cart')
			}
			,toClose: function(){
				this.is_modal = false
			}
		}
		,created() {
			//this.$emit('onLoad', this.program)
			this.getData()
		}
		,watch:{
			/*
			pdt_options: {
				deep: true
				,handler: function (call){
					this.resetOption(call)
				}
			}

			,*/ option: {
				deep: true
				,handler: function (call){
					let full = true

					// 전체 옵션 선택여부 체크
					call.forEach(function(item){
						if(!item){
							full = false
							return false
						}
					})

					// 전체 옵션 선택시 상품으로 추가
					if(full){
						let val = {
							odt: call.toString()
							,odt_price: 0
							,odt_cnt: 1
						}

						let result = this.options.filter(function(item){
							if(item.odt == val.odt){
								return item.odt_cnt++
							}
						})

						if(result.length){
							result.odt_cnt++
						}else{
							this.options.push(val)
						}

						this.resetOption(this.option)
					}
				}
			}
			,file_index: {
				handler: function(call){
					if(this.files.sub.length > 0) {
						if (call < 0) {
							this.file_index = this.files.sub.length - 1
						} else if (call >= this.files.sub.length) {
							this.file_index = 0
						}
					}
				}
			}
		}
	}

</script>

<style type="text/css">
.pdt-title {
	padding: 0;
	font-size: 14px;
	color: black;
}

.pdt-price {
	font-size: 16px;
	color: black;
	font-weight: bold;
	font-family: Helvetica,Apple-Gothic,Dotum,"돋움",Gulim,"굴림";
}

.pdt-img1 img {
	width: 50%;
}


.pdt-pdt_options {
	margin-top: 20px;
}

.pdt-option:first-child,
.li-pdt-option:first-child {

}

.pdt-option {
	border: 1px solid #bbb;
	border-radius: 2px;
	margin-top: 10px;
	padding: 10px;
}

.pdt-option .option-name {
	color: black;
	font-weight: bold;
}

.ul-pdt-option {
}

.li-pdt-option {
	border: 1px solid #ddd;
	border-radius: 10px;
	padding: 10px;
	margin-bottom: 10px;
}

.li-pdt-option:active {
	background-color: #eee;
}

.pdt-cnt {
	padding: 10px;
	border: 1px solid #ddd;
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

.left,
.right {
	background: none !important;
}

.carousel-control {
	color: black;
}

.shadow-top {
	box-shadow: 0px 2px 5px black;
}

.span-pdt-cnt {
	display: inline !important; line-height: 240%;
}

.select {
	width: 100%;
	padding: 10px;
	color: black;
}


.pdt-info img,
.pdt-notice img {
	max-width: 100%;
}
</style>
