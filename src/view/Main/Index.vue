<template>
	<div class="flex-column full-height bg-withe">

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
					@click="list_type = 'list'"
				>mdi mdi-view-list</v-icon>
				<v-icon
					class="box pa-5 "
					:class="list_type == 'grid' ? 'bg-gray' : 'bg-white'"
					@click="list_type = 'grid'"
				>mdi mdi-view-grid</v-icon>
			</span>
		</div>
		<ul
			v-if="!item.uid"
			class=" main-pdt overflow-y-auto"
			:class="list_type"
		>
			<template
				v-if="items.length > 0"
			>
			<li
				v-for="item in items"
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
					<div class="pdt-title">{{  item.pdt_name }}</div>
					<div class="price">{{ item.pdt_price | makeComma }}</div>

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
		></ProductDetail>
	</div>
</template>

<script>
	

	import ProductDetail from "../Product/ProductDetail";
	export default{
		name: 'Main'
		,
		components: {ProductDetail},
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
				,items: [
					{}, {}, {}, {}
				]
				,item: {

				}
				,search: {
					TOKEN: this.TOKEN
					,sort: 'new'
				}
				,list_type: 'grid'
			}
		}
		,methods: {
			getData: async function(){
				const result = await this.Axios({
					method: 'post'
					,url: 'product/getMainProduct'
					,data: this.search
				})

				if(result.success){
					this.items = result.data.result.result
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
				this.setProgram(this.program)
			}
			,setProgram(program){
				this.$emit('onLoad', program)
			}
			,setNotify({ type, message}){
				this.$emit('setNotify', { type: type, message: message })
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
</style>
