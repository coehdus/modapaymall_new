<template>
	<div
		class="full-height flex-column "
	>
		<div class="tab justify-space-between under-line">
			<div
				class="flex-1 pa-10 text-center "
				:class="{ on: search.is_cancel == 0}"
				@click="getTypeData(0)"
			>구독중</div>
			<div
				class="flex-1 pa-10 text-center box-rl"
				:class="{ on: search.is_cancel == 1}"
				@click="getTypeData(1)"
			>구독완료</div>
			<div
				class="flex-1 pa-10 text-center "
				:class="{ on: search.is_cancel == 2}"
				@click="getTypeData(2)"
			>구독취소</div>
		</div>
		<div
			class=" pa-10 flex-column full-height  bg-gray-light overflow-y-auto"
		>
			<ul
				v-if="items.length > 0"
				class="full-height overflow-y-auto"
			>
				<!-- 주문 내역-->
				<li
					v-for="(item, index) in items"
					:key="'item_' + index"
					class=" bg-white mt-10 box-shadow position-relative "
					@click="toDetail(item)"
				>

					<div class="pa-10 flex-row justify-space-between under-line">
						<div>
							<span v-if="item.is_cancel == 0" class="label label-primary">구독중</span>
							<span v-else-if="item.is_cancel == 1" class="label label-success">구독완료</span>
							<span v-else-if="item.is_cancel == 2" class="label label-cancel">구독취소</span>
						</div>
						<div>매월 {{ item.regular_date }}일</div>
					</div>
					<div class="flex-row items-center under-line pb-10 pa-10">
						<div class="square-64  text-center flex-column justify-center mr-10">
							<img
								v-if="!item.is_error"
								:src="$pdt_img_url + item.pdt_img" class="width-100" @error="item.is_error = true"/>
							<v-icon
								v-else
								>mdi-image-area</v-icon>
						</div>
						<div class="flex-1 flex-column ">
							<div>{{ item.pdt_name }}</div>
						</div>
					</div>

					<div class="pa-10 flex-row justify-space-between">
						<div>{{ item.bill_name }} </div>
						<div>{{ item.order_price | makeComma}}원</div>
					</div>
				</li>
			</ul>

			<Empty
				v-else
			></Empty>

			<Pagination
				:program="program"
				:align="'center'"
				:options="search"

				@click="getSearch"

				class="mt-auto pa-10"
			></Pagination>
		</div>
	</div>
</template>

<script>

import Pagination from "../../components/Pagination";
import Empty from "@/view/Layout/Empty";

export default{
	name: 'OrderList'
	, components: {Empty, Pagination}
	, props: ['Axios', 'member_info', 'TOKEN', 'codes']
	,data: function() {
		return {
			program: {
				name: '정기결제내역'
				, top: false
				, title: true
				, bottom: true
			}
			,search: this.$storage.init({
				sDate: ''
				, eDate: ''
				, type: this.$route.params.type
				, page: 1
				, list_cnt: 10
				, is_cancel: 0
			})
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
			,odt_step_cancel_confirm: 'step22'
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

	}
	,methods: {
		getData: async function(){

			console.log(this.search)

			try{
				this.$bus.$emit('on', true)
				const result = await this.Axios({
					method: 'get'
					,url: 'order/getOrderRegular'
					,data: this.search
				})

				if(result.success){
					this.items = result.data.result
					this.$set(this.search, 'total_count', result.data.tCnt)
					this.$storage.setQuery(this.search)
				}else{
					throw result.message
				}
			}catch(e){
				console.log(e)
				this.$bus.$emit('notify', { type: 'error', message: e })
			}finally {
				this.$bus.$emit('on', false)
			}
		}
		, toDetail: function(item){
			this.$router.push({name: 'OrderRegularDetail', params: { idx: item.uid}})
		}
		, getSearch: function(page = 1){
			if(page){
				this.search.page = page
			}

			this.getData()
		}
		, getTypeData: function(type){
			this.search.is_cancel = type
			this.getData()
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