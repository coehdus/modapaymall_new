<template>
	<div
		class="full-height flex-column full-width bg-white"
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
										:src="$pdt_img_url + file.file_path" alt="main1"
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

			<div class="mt-10 top-line pt-10 top-line under-line-dashed pb-10 font-weight-bold">
				{{ item.pdt_name }}
			</div>
			<div
				class="mt-10 flex-row justify-space-between under-line-dashed pb-10"
			>
				<div
					class="pdt-rate"
				>평점 {{ item.pdt_grade }}</div>
				<div
					class="pdt-price"
				>
					<template
						v-for="no in 5"
					>
						<v-icon
							:key="'star_' + no"
							:class="item.pdt_grade >= no ? 'color-yellow' : ''"
						>mdi mdi-star</v-icon>
					</template>
				</div>
			</div>

			<div
				class="mt-10 flex-row justify-space-between under-line-dashed pb-10 "
			>
				<div
					class="pdt-rate"
				>판매가</div>
				<div
					class="pdt-price"
				>{{  item.pdt_price | makeComma }} 원</div>
			</div>

			<div
				v-if="item.is_regular == '1'"
				class="mt-10 flex-row justify-space-between under-line-dashed pb-10 "
			>
				<div
					class="pdt-rate"
				>정기구매 가능 상품</div>
				<div
					class="pdt-price"
					@click="setBuy('bill')"
				><button class="label label-primary size-px-12"><v-icon class="color-white mr-5" small>mdi-arrow-left-bold-box-outline</v-icon>정기구매</button></div>
			</div>

			<div
				v-if="item.pdt_delivery > 0"
				class="mt-10 justify-space-between under-line-dashed pb-10"
			>
				<div>상품 개별 배송비</div>
				<div
					class="pdt-price"
				>{{ item.pdt_delivery | makeComma}} 원</div>
			</div>


			<div
				v-if="item.is_sold == 2"
				class="mt-10 flex-row justify-space-between under-line-dashed pb-10"
			>
				<div
					class="pdt-price"
				><span v-if="item.pdt_stock < 10" class="color-red">품절임박</span></div>
				<div
					class="pdt-rate"
				>수량 {{ item.pdt_stock | makeComma }} 개</div>
			</div>

			<template
				v-if="pdt_options.length > 0"
			>
			<h6 class="mt-10 " >선택 옵션</h6>
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
			</template>


			<h6 class="mt-10">상품 설명</h6>
			<div
				class="mt-10 input-box pdt-info"
				v-html="item.pdt_info ? item.pdt_info.replaceAll('\n', '<br/>') : '상품 설명이 없습니다.'"
			>
			</div>

			<h6 class="mt-10">상세 정보</h6>
			<div
				class="mt-10 input-box pdt-info"
			>
				<Viewer
					v-if="false"
					:initialValue="item.pdt_info"
				/>
				<div
					v-if="files.file.length > 0"
				>
					<div
						v-for="(file, index) in files.file"
						:key="'file_' + index"
					><img :src="file.file_path" /></div>
				</div>
				<div
					v-else
				>상품 정보가 없습니다</div>
			</div>

			<h6 class="mt-10 ">교환/반품 정보</h6>
			<div
				class="mt-10 input-box pdt-notice mb-30"
			>
				<Viewer
					v-if="false"
					:initialValue="item.pdt_notice"
				/>
				<div
					v-if="files.delivery"
				><img :src="files.delivery.file_path" /></div>
				<div
					v-else
				>교환/반품 정보가 없습니다</div>
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
					@click="setBuy('buy')"
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

			@close="toClose"
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
		,props: ['Axios', 'cart_cnt', 'TOKEN']
		,components: { Modal, Viewer}
		,data: function(){
			return {
				program: {
					name: '상품 상세'
					,top: false
					,title: false
					,bottom: false
				}
				,item: {}
				// 상품옵션
				,pdt_options: []
				// 판매자 정보
				,seller_info: {
					
				}
				//장바구니
				,cart_items: [
					
				]
				,pdt_cnt: 1
				,files: {
					main: []
					, sub: []
					, file: []
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
				let agency_sale_price = this.item.pdt_price
				this.options.forEach(function(item){
					price += Number(item.odt_cnt) * (Number(agency_sale_price) + Number(item.odt_price))
				})
				return price
			}
			,odts: function(){
				return this.options.filter(function(item){
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
							pdt_uid: this.$route.params.idx
						}
					})

					if (result.success) {
						this.item = result.data.pdt_info
						this.$set(this, 'pdt_options', result.data.pdt_options)

						this.resetOption(this.pdt_options)
						this.files = result.data.pdt_files
						this.seller_info = result.data.seller_info
					} else {
						this.$bus.$emit('notify', {type: 'error', message: result.message})
					}
				}catch(E){
					console.log(E)
				}
			}
			,setBuy: async function(type) {
				if(this.options.length <= 0){
					this.$bus.$emit('notify', { type: 'error', message: '옵션을 선택하세요'})
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
						if(type == 'bill'){
							await this.$router.push({ name: 'OrderBill'})
						}else{
							await this.$router.push({ name: 'OrderBuy'})
						}
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
					this.$bus.$emit('notify', { type: 'error', message: 'DB 오류'})
				}
			}

			,setCart: async function(){
				if(this.options.length <= 0){
					this.$bus.$emit('notify', { type: 'error', message: '옵션을 선택하세요'})
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
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
					this.$bus.$emit('notify', { type: 'error', message: 'DB 오류'})
				}
			}
			,toBack: function(){
				this.$emit('toBack')
			}
			,toggleOption: function(option){
				this.$set(option, 'is_view', !option.is_view)
			}
			,setOption: function(option, opt){
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
				this.$storage.push({ name: 'Cart'})
			}
			,toClose: function(){
				this.is_modal = false
			}
			,setCnt: function(odt, type){
				if(type == 'down'){
					if(odt.odt_cnt <= 1){
						odt.odt_cnt = 1
						return
					}else{
						odt.odt_cnt--
					}
				}else{
					if(odt.odt_cnt > 99){
						odt.odt_cnt = 99
						return
					}else{
						odt.odt_cnt++
					}
				}
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
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
