<template>
	<div
		ref="body"
		class="full-height flex-column"
	>
		<Top
			:program="program"
			:member_info="member_info"
			:seller_info="seller_info"

		></Top>

		<Search
			v-if="program.search"
			:program="program"
			:search="search"

			@click="getSearch"
		></Search>



		<div
			class="pa-10 under-line "
			style="max-width: 100%; min-height: 55px; white-space: nowrap; overflow-x: scroll; overflow-y: hidden"
		>
			<ul>
				<li
					v-for="category in category_list"
					:key="'category_' + category.category_code"

					class="inline-block mr-10"
				>
					<button
						class=" radius-10 pa-5-10"
						:class="category.category_code == category_now.category_code ? 'bg-identify' : 'bg-gray color-bbb'"
						@click="toCategory(category)"
					>{{ category.category_name }}</button>
				</li>
			</ul>
		</div>

		<div
			class="pa-10 justify-space-between "
		>
			<select
				v-model="search.sort"
				class="pa-5 box bg-white"
				@change="getSearch"
			>
				<option
					v-for="sort in codes.P002.items"
					:key="'sort_' + sort.sub_code"
					:value="sort.code_value ? sort.code_value : ''"
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


		<div
			v-if="items.length > 0"
			class=" "
		>
			<ul
				class=" main-pdt "
				:class="list_type"
			>
				<li
					v-for="item in item_list"
					:key="item.pdt_uid"
					class="main-box-pdt position-relative"

					@click="toDetail(item)"
				>
					<div class="pdt-img ">
						<img
							v-if="item.pdt_img1"
							:src="$pdt_img_url + item.pdt_img1"
						/>
						<v-icon
							v-else
							class="mdi mdi-image none-img"
						></v-icon>
					</div>
					<div class="pdt-info ">
						<div class="pdt-title ">{{  item.pdt_name }}</div>
						<div class="pdt-title ">{{  item.pdt_summary }}</div>
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
		<Empty
			v-else
		></Empty>

		<More
			v-if="$refs.body"
			:body="$refs.body"
		></More>
	</div>
</template>

<script>

import Pagination from "@/components/Pagination";
import Search from "@/view/Layout/Search";
import Empty from "@/view/Layout/Empty";
import Top from "../Layout/Top";
import More from "../Layout/More";

export default{
	props: ['Axios', 'user', 'codes', 'date', 'callBack', 'TOKEN', 'cart_cnt', 'category', 'member_info', 'seller_info']
	,components: {More, Top, Empty, Search, Pagination }
	,data: function(){
		return {
			program: {
				name: "상품 목록 " +this.$route.params.category
				,code: 'product_list'
				,title: false
				,search: true
				,bottom: true
			}
			,search: this.$storage.init({
				search_type: 'pdt_name'
				,search_value: ''
				,pdt_category: this.$route.params.category
				,sort: ''
			})
			,summary: {
				total: 0
			}
			,items: [

			]
			,item: {

			}
			,category_now: {
				category_code: ''
			}
			,list_type: localStorage.getItem('list_type') ? localStorage.getItem('list_type') : 'grid'
		}
	}
	,computed:{
		item_list: function(){

			let self = this
			return this.items.filter(function(item){
				if(item.pdt_info){
					item.pdt_info = item.pdt_info.replaceAll('/API/', self.$server_url)
				}
				if(item.pdt_notice){
					item.pdt_notice = item.pdt_notice.replaceAll('/API/', self.$server_url)
				}
				if(item.is_sold == 0 || (item.is_sold == 2 && item.pdt_stock > 0)){
					item.is_sale = true
				}
				return item
			})
		}
		,category_list: function(){
			let list = []

			if(!this.category){
				return list
			}
			this.category.filter((item) => {
				if(item.category_code === this.search.pdt_category){
					this.$set(this, 'category_now', item)
				}
			})

			if(this.category_now) {
				this.category.filter((item) => {
					if (this.category_now.depth == item.depth) {
						list.push(item)
					}
				})
			}

			return list
		}
	}
	,methods: {
		getData: async function() {

			this.$bus.$emit('on', true)

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
					this.$storage.setQuery(this.search)
				} else {
					this.$bus.$emit('notify', {type: 'error', message: result.message})
				}
			} catch (e) {
				this.$bus.$emit('notify', {type: 'error', message: e})
			} finally {
				this.$bus.$emit('on', false)
			}
		}
		,toDetail(item){
			this.$storage.push({ name: 'ProductDetail', params: { idx: item.uid }, not_query: true})
		}
		,clear(){
			this.$set(this, 'item', {})
			//this.setProgram(this.program)
		}
		,setNotify({ type, message}){
			this.$bus.$emit('notify', { type: type, message: message })
		}
		,setProgram(program){
			this.$emit('onLoad', program)
		}
		,toCart: function(){
			this.$emit('push', 'Cart')
		}
		,toCategory: function(category){
			this.category_now = category
			this.search.pdt_category = category.category_code
			this.getSearch()
		}
		,setListType: function(list_type){
			this.list_type = list_type
			localStorage.setItem('list_type', list_type)
		}
		,getSearch: async function(){
			this.items = []
			this.search.page = 1
			await this.getData()
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
	flex: 2;
	margin-right: 10px;
	padding: 5px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-left: 5px;
	min-height: 130px;
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
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-height: 150px;
}

ul.grid .pdt-img img { display: block; margin: auto; width: 100%}

.pdt-img {
	overflow: hidden;
	border: 1px solid #ddd;
}
.pdt-img img { max-width: 150px;  }
</style>