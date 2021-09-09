<template>
	<div
		class=" full-height "
	>
		<div
			class="pa-10  flex-row under-line overflow-x-auto"
		>
			<button
				v-for="category in category_list"
				:key="'category_' + category.category_code"
				class="prl-10 size-px-12 radius-10 mr-10"
				:class="category.category_code == category_now.category_code ? 'bg-black' : 'bg-gray color-bbb'"
				style="flex-shrink: 0;"
				@click="toCategory(category)"
			>{{ category.category_name }}</button>
		</div>

		<div
			class="pa-10 justify-space-between "
		>
			<select
				v-model="search.sort"
				class="pa-5 box bg-white"
				@change="getData"
			>
				<option
					v-for="sort in codes.P002.items"
					:key="'sort_' + sort.sub_code"
					:value="sort.code_value"
				>{{ sort.code_name }}</option>
			</select>

			<span>
				<v-icon
					class="box pa-5 mr-5 "
					:class="list_type == 'list' ? 'bg-gray' : 'bg-white'"
					@click="setListType('list')"
				>mdi mdi-view-list</v-icon>
				<v-icon
					class="box pa-5 "
					:class="list_type == 'grid' ? 'bg-gray' : 'bg-white'"
					@click="setListType('grid')"
				>mdi mdi-view-grid</v-icon>
			</span>
		</div>
		<template
		>
			<div
				v-if="items.length > 0"
			>
				<ul
					class=" main-pdt overflow-y-auto"
					:class="list_type"
				>
					<li
						v-for="item in item_list"
						:key="item.pdt_uid"
						class="main-box-pdt position-relative"

						@click="goDetail(item)"
					>
						<div class="pdt-img ">
							<img
								v-if="item.pdt_img1"
								:src="'http://delimall.co.kr/API/data/product/' + item.pdt_img1"
							/>
							<v-icon
								v-else
								class="mdi mdi-image none-img"
							></v-icon>
						</div>
						<div class="pdt-info ">
							<div class="pdt-title color-gray">{{  item.pdt_name }}</div>
							<div
								v-if="item.is_sale"
								class="price font-weight-bold"
							>{{ item.agency_sale_price | makeComma }} 원</div>
							<div
								v-else
								class="price font-weight-bold justify-space-between"
							>
								<span class="text-through color-gray">{{ item.agency_sale_price | makeComma }} 원</span>
								<span class="mr-5 color-red">품절</span>
							</div>

							<div
								v-if="list_type == 'list'"
								class="color-blue "
								style="right: 10px; top: -10px;"
							>
								<template
									v-if="item.agency_pdt_type"
								>
						<span
							v-if="item.agency_pdt_type.indexOf('new') > -1"
							class="label label-new mr-5"
						>NEW</span>
									<span
										v-if="item.agency_pdt_type.indexOf('hot') > -1"
										class="label label-hot mr-5"
									>HOT</span>
									<span
										v-if="item.agency_pdt_type.indexOf('recomm') > -1"
										class="label label-recomm mr-5"
									>추천</span>
									<span
										v-if="item.agency_pdt_type.indexOf('season') > -1"
										class="label label-season"
									>계절</span>
								</template>

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

					class="pa-10"
				></Pagination>
			</div>
			<div
				v-else
				class="flex-column full-height justify-center bg-white"
			>
				<div class="text-center">
					<v-icon class="size-px-48">mdi-cloud-off-outline</v-icon>
					<p class="mt-10 size-px-16">조회된 상품이 없습니다.</p>
				</div>
			</div>
		</template>
		<ProductDetail
			v-if="item.uid"
			:item="item"
			:date="date"
			:callBack="callBack"
			:Axios="Axios"
			:cart_cnt="cart_cnt"

			@click="clear"
			@onLoad="setProgram"
			@setNotify="setNotify"
			@getCartList="$emit('getCartList')"
			@push="toCart"

		></ProductDetail>
	</div>
</template>

<script>

import ProductDetail from "@/view/Product/ProductDetail";
import Pagination from "@/components/Pagination";

export default{
	props: ['Axios', 'user', 'codes', 'date', 'callBack', 'TOKEN', 'cart_cnt', 'category']
	,components: {Pagination, ProductDetail }
	,data: function(){
		return {
			program: {
				name: "상품 목록 " +this.$route.params.category
				,code: 'product_list'
				,top: true
				,title: false
				,search: true
				,bottom: true
			}
			,search: {
				TOKEN:  this.TOKEN
				,pdt_name: ''
				,pdt_category: this.$route.params.category
				,sort: 'new'
			}
			,summary: {
				total: 0
			}
			,items: [

			]
			,item: {

			}
			,category_now: null
			,list_type: localStorage.getItem('list_type') ? localStorage.getItem('list_type') : 'grid'
		}
	}
	,computed:{
		item_list: function(){

			return this.items.filter(function(item){
				if(item.pdt_info){
					item.pdt_info = item.pdt_info.replaceAll('/API/', 'http://delimall.co.kr/API/')
				}
				if(item.pdt_notice){
					item.pdt_notice = item.pdt_notice.replaceAll('/API/', 'http://delimall.co.kr/API/')
				}
				if(item.is_sold == 0 || (item.is_sold == 2 && item.pdt_stock > 0)){
					item.is_sale = true
				}
				return item
			})
		}
		,category_list: function(){
			let list = []
			let self = this
			if(!this.category){
				return list
			}
			this.category.filter(function(item){
				if(item.category_code == self.$route.params.category){
					self.$set(self, 'category_now', item)
				}
			})

			this.category.filter(function(item){

				if(self.category_now.depth == item.depth){
					list.push(item)
				}
			})

			return list
		}
	}
	,methods: {
		getData: async function() {

			this.$emit('onLoading')

			try {
				const result = await this.Axios({
					method: 'get'
					, url: 'product/getProductList'
					, data: this.search
				})

				if (result.success) {
					let item = this.items
					this.items = item.concat(result.data.result)
					this.$set(this.search, 'total_count', result.data.tCnt)

				} else {
					this.$emit('setNotify', {type: 'error', message: result.message})
				}
			} catch (E) {
				console.log(E)
				this.$emit('setNotify', {type: 'error', message: E})
			} finally {
				this.$emit('offLoading')
			}
		}
		,goDetail(item){
			item.TOKEN = sessionStorage.getItem('delimallT')
			this.$set(this, 'item', item)
		}
		,clear(){
			this.$set(this, 'item', {})
			//this.setProgram(this.program)
		}
		,setNotify({ type, message}){
			this.$emit('setNotify', { type: type, message: message })
		}
		,setProgram(program){
			this.$emit('onLoad', program)
		}
		,toCart: function(){
			this.$emit('push', 'Cart')
		}
		,toCategory: function(category){
			this.$emit('push', 'ProductList', { category: category.category_code })
		}
		,setListType: function(list_type){
			this.list_type = list_type
			localStorage.setItem('list_type', list_type)
		}
	}
	,created: function(){
		this.$emit('onLoad', this.program)
		this.getData()
	}
	,watch: {

	}
}
</script>

<style>
.box-payment-list.shadow {
	box-shadow: 0px 5px 10px rgb(0, 0, 0, 0.2)
}


ul.list {
	height: 100%
}
ul.list li {
	display: flex;
	border-bottom: 1px solid #ddd;
	padding: 10px 0;
}

ul.list .pdt-img {
	flex: 1;
	margin-right: 10px;
	padding: 5px;
	height: 80px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

ul.list .pdt-info {
	flex: 3;
}

ul.grid {
	display: flex;
	flex-wrap: wrap;
}
ul.grid .pdt-info {

}
ul.grid li { width: calc(50% - 10px); margin-bottom: 20px;}
ul.grid li:nth-child(odd) { margin: 0px 5px 20px 5px;}
ul.grid li:nth-child(even) { margin: 0px 5px 20px 5px;}

ul.grid .pdt-img {
	width: 100%;
	background-color: #eee;
	text-align: center;
	height: 120px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

ul.grid .pdt-img img { display: block; margin: auto; width: 100%}

.pdt-img {
	overflow: hidden
}
</style>