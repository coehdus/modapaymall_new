<template>
	<div class="flex-column full-height bg-withe">

		<div
			class="box-main-banner position-relative"
		>
			<v-icon
				class="position-absolute arrow-left"
			>mdi mdi-chevron-left</v-icon>
			<ul
				class="ul-main-banner"
			>
				<template
					v-if="banner_items.length > 0"
				>
				<li
					v-for="(banner, key) in banner_items"
					:key="'banner_' + key"
				>
					<img
						v-if="banner.img"
						:src="banner.img"
					/>
					<v-icon
						v-else
					>mdi mdi-image</v-icon>
				</li>
				</template>
				<li
					v-else
					class="no-banner"
				>no banner</li>
			</ul>
			<v-icon
				class="position-absolute arrow-right"
			>mdi mdi-chevron-right</v-icon>
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

		<div class="flex-column">
			<ul
				class=" main-pdt overflow-y-auto"
				:class="list_type"
			>
				<template
					v-if="items.length > 0"
				>
				<li
					v-for="item in item_list"
					:key="item.uid"
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
						<div class="pdt-title color-gray">{{  item.pdt_name }} {{ item.uid }}</div>
						<div class="price font-weight-bold">{{ item.pdt_price | makeComma }} 원</div>

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
				</template>
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

		<ProductDetail
			v-if="item.uid"
			:item="item"
			:Axios="Axios"
			:cart_cnt="cart_cnt"

			@click="clear"
			@onLoad="setProgram"
			@setNotify="setNotify"
			@getCart="$emit('getCart')"
			@push="$emit('push', 'Cart')"
			@getCartList="$emit('getCartList')"
		></ProductDetail>
	</div>
</template>

<script>
	

	import ProductDetail from "../Product/ProductDetail";
	import Pagination from "@/components/Pagination";
	export default{
		name: 'Main'
		,
		components: {Pagination, ProductDetail},
		props: ['Axios', 'cart_cnt', 'codes', 'TOKEN']
		,data: function(){
			return {
				program: {
					name: '딜리몰'
					,top: true
					,title: false
					,search: true
					,bottom: true
				}
				,member_info: {

				}
				,banner_items: [

				]
				,items: [
				]
				,item: {

				}
				,search: {
					TOKEN: this.TOKEN
					,sort: 'new'
					,list_cnt: 10
					,page: 1
				}
				,list_type: localStorage.getItem('list_type') ? localStorage.getItem('list_type') : 'grid'
			}
		}
		,computed: {
			item_list: function (){
				return this.items.filter(function(item){
					if(item.pdt_info){
						item.pdt_info = item.pdt_info.replaceAll('/API/', 'http://delimall.co.kr/API/')
					}
					if(item.pdt_notice){
						item.pdt_notice = item.pdt_notice.replaceAll('/API/', 'http://delimall.co.kr/API/')
					}
					return item
				})
			}
		}
		,methods: {
			getData: async function(){
				const result = await this.Axios({
					method: 'get'
					,url: 'product/getMainProduct'
					,data: this.search
				})

				if(result.success){
					let item = this.items
					this.items = item.concat(result.data.result)
					this.$set(this.search, 'total_count', result.data.tCnt)
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message})
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
			,setProgram(program){
				this.$emit('onLoad', program)
			}
			,setNotify({ type, message}){
				this.$emit('setNotify', { type: type, message: message })
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
	}
	
</script>

<style>

	.label { color: white; border-radius: 5px; padding: 3px 7px 3px; line-height: 12px !important; font-size: 10px;}
	.label-new { background-color: #0D47A1;}
	.label-hot { background-color: #e64a19;}
	.label-recomm { background-color: #0f9d58;}
	.label-season { background-color: #00b0ff;}

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

	.box-main-banner {
		background-color: #eee;
	}

	.box-main-banner .no-banner {
		text-align: center;
		padding: 30px 0;
	}

	.box-main-banner .arrow-left{
		left: 10px;
		top: calc(50% - 12px);
	}
	.box-main-banner .arrow-right{
		right: 10px;
		top: calc(50% - 12px);
	}
</style>
