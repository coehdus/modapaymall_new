<template>
	<div class="flex-column full-height bg-white" ref="body">

		<Top
			:program="program"
			:member_info="member_info"
			:seller_info="seller_info"

		></Top>
		<Search
			v-if="program.search"
			:program="program"
			:search="search"

			@click="toList"
		></Search>

		<div
			v-if="is_banner && banner_items.length > 0"
			class="box-main-banner position-relative"
		>
			<v-icon
				class="position-absolute arrow-left"
				@click="banner_prev"
			>mdi mdi-chevron-left</v-icon>
			<ul
				class="ul-main-banner"
			>
				<template
					v-if="is_banner && banner_items.length > 0"
				>
				<li
					v-for="(banner, banner_index) in banner_list"
					v-show="banner_item.uid == banner.uid"
					:key="'banner_' + banner_index"
					@click="toLink(banner)"
				>
					<transition
						enter-class="enter"
					>
					<div
						class="banner-img"
						:style="'background: url(' + banner.banner_img + ') no-repeat center center; background-size: 100%'"
					>
					</div>
					</transition>
				</li>
				</template>
				<li
					v-else
					class="no-banner"
				>no banner</li>
			</ul>
			<v-icon
				class="position-absolute arrow-right"
				@click="banner_next"
			>mdi mdi-chevron-right</v-icon>
		</div>

		<div
			class="pa-10 justify-space-between "
		>
			<select
				v-model="search.sort"
				class="pa-5 box bg-white"
				@change="setSort"
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

		<template
			v-if="items.length > 0"
		>
		<div class="flex-column" >
			<ul
				class=" main-pdt overflow-y-auto"
				:class="list_type"
			>
				<li
					v-for="item in item_list"
					:key="item.uid"
					class="main-box-pdt position-relative"

					@click="toDetail(item)"
				>
					<div class="pdt-img">
						<img v-if="item.pdt_img"
							:src="item.pdt_img"
						/>
						<v-icon
							v-else
							class="mdi mdi-image none-img"
						></v-icon>
					</div>
					<div class="pdt-info ">
						<div class="pdt-title color-333">{{  item.pdt_name }}</div>
						<div
							v-if="item.is_sale"
							class="price font-weight-bold"
						>{{ item.pdt_price | makeComma }} 원</div>
						<div
							v-else
							class="price font-weight-bold justify-space-between"
						>
							<span class="text-through color-gray">{{ item.pdt_price | makeComma }} 원</span>
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
		</template>
		<div v-else class="text-center pa-50">등록된 상품이 없습니다</div>

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

		<More
			v-if="$refs.body"
			:body="$refs.body"
		></More>
	</div>
</template>

<script>

	import ProductDetail from "../Product/ProductDetail";
	import Pagination from "@/components/Pagination";
	import Search from "@/view/Layout/Search";
	import Top from "../Layout/Top";
	import More from "../Layout/More";

	export default{
		name: 'Main'
		, components: {More, Top, Search, Pagination, ProductDetail}
		, props: ['Axios', 'cart_cnt', 'codes', 'TOKEN', 'filter', 'seller_info', 'member_info']
		, data: function(){
			return {
				program: {
					name: process.env.VUE_APP_TITLE_DEV
					,title: false
					,search: true
					,bottom: true
				}
				,banner_items: []
				,banner_item: {}
				,banner_index: 0
				,items: []
				,item: {}
				,search: this.$storage.init({
					sort: ''
					,list_cnt: 10
					,page: 1
					,search_type: 'pdt_name'
				})
				,list_type: localStorage.getItem('list_type') ? localStorage.getItem('list_type') : 'grid'
				,slide_option: {
					perPage		: 1
					,arrows 	: false
					,autoplay   : false
					,start		: 0
					,focus		: 0
					,pagination  : false
				}
				,interval_banner: null
			}
		}
		,computed: {
			item_list: function (){

				return this.items.filter((item) => {
					if(item.pdt_info){
						item.pdt_info = item.pdt_info.replaceAll('/API/', this.$server_url)
					}
					if(item.pdt_notice){
						item.pdt_notice = item.pdt_notice.replaceAll('/API/', this.$server_url)
					}

					if(item.pdt_img1){
						item.pdt_img = this.$pdt_img_url + item.pdt_img1
					}

					if(item.is_sold == 0 || (item.is_sold == 2 && item.pdt_stock > 0)){
						item.is_sale = true
					}

					return item
				})
			}
			,banner_list: function(){

				return this.banner_items.filter((item) => {
					if(item.file_path){
						item.banner_img = this.codes.banner_url + item.file_path
					}
					return item
				})
			}
			,is_banner: function(){
				let is = true

				let location = window.location.href
				let domain = process.env.VUE_APP_DOMAIN

				if(location.indexOf(domain) > -1){
					is = true
				}

				return is
			}
		}
		,methods: {
			getData: async function(){
				this.$bus.$emit('on', true)
				try {
					const result = await this.Axios({
						method: 'get'
						, url: 'product/getMainProduct'
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
				}catch (e) {
					this.$bus.$emit('notify', { type: 'error', message: e})
				}finally {
					this.$bus.$emit('on', false)
				}
			}
			,getBannerData: async function(){
				try {
					const result = await this.Axios({
						method: 'get'
						, url: 'main/getMainBanner'
						, data: {
						}
					})

					if (result.success) {
						this.banner_items = result.data
						this.banner_item = result.data[this.banner_index]
						this.banner_next()
					} else {
						this.$bus.$emit('notify', {type: 'error', message: result.message})
					}
				}catch (e) {
					this.$bus.$emit('notify', { type: 'error', message: e})
				}
			}
			,toDetail(item){
				this.$storage.push({ name: 'ProductDetail', params: { idx: item.uid }})
			}
			,clear(){
				this.$set(this, 'item', {})
				//this.setProgram(this.program)
			}
			,setProgram(program){
				this.$emit('onLoad', program)
			}
			,setNotify({ type, message}){
				this.$bus.$emit('notify', { type: type, message: message })
			}
			,setListType: function(list_type){
				this.list_type = list_type
				localStorage.setItem('list_type', list_type)
			}
			,setSort: function(){
				this.items = []
				this.search.page = 1
				this.getData()
			}
			,banner_prev: function(){
				clearTimeout(this.interval_banner)
				this.banner_index--
				if(this.banner_index < 0){
					this.banner_index = this.banner_items.length - 1
				}

				this.banner_item = this.banner_items[this.banner_index]
				this.interval_banner = setTimeout(() => {
					this.banner_next()
				}, 5000)
			}
			,banner_next: function(){

				clearTimeout(this.interval_banner)
				this.banner_index++
				if(this.banner_index >= this.banner_items.length){
					this.banner_index = 0
				}

				this.banner_item = this.banner_items[this.banner_index]
				this.interval_banner = setTimeout(() => {
					this.banner_next()
				}, 5000)
			}
			,toLink: function(banner){
				if(banner.banner_link){
					if(banner.is_out == '0'){
						document.location.href = banner.banner_link
					}else{
						window.open(banner.banner_link, 'banner')
					}
				}
			}
			,toList: function(){
				this.$emit('push', { name: 'ProductList'})
			}
		}
		,created: function(){
			this.$emit('onLoad', this.program)
			this.getData()
			this.getBannerData()
		}
	}
	
</script>

<style>

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
		color: #333;
	}

	ul.grid {
		display: flex;
		flex-wrap: wrap;
	}
	ul.grid .pdt-info {
		text-align: center;
		color: #333;
	}
	ul.grid li { width: calc(50% - 10px); margin-bottom: 20px;}
	ul.grid li:nth-child(odd) { margin: 0px 5px 20px 5px;}
	ul.grid li:nth-child(even) { margin: 0px 5px 20px 5px;}

	ul.grid .pdt-img {
		width: 100%;
		background-color: white;
		text-align: center;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 5px;
		min-height: 150px;
	}

	ul.grid .pdt-img img { display: block; margin: auto; width: 100%; height: 100%}

	.pdt-img {
		overflow: hidden;
		border: 1px solid #ddd;
	}

	.pdt-img img { max-width: 150px;  }

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

	.ul-main-banner {
		border-bottom: 1px solid #ddd
	}
	.ul-main-banner li {
		min-height: 40px;
		text-align: center;
	}
	.banner-img { width:100%; padding: 90px}
	.banner-img img { width: 100%; max-height: 160px}

	.enter {
		transition: opacity 1s
	}
</style>
