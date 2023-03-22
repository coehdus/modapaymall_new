<template>
	<div
		class="full-height flex-column "
	>
		<div
			class="pa-10 flex-column full-height  bg-gray-light overflow-y-auto"
		>
			<ul
				v-if="items.length > 0"
				class="full-height overflow-y-auto"
			>
				<!-- 주문 내역-->
				<li
					v-for="(item, index) in items"
					:key="'item_' + index"
					class=" bg-white mt-10 box-shadow position-relative"
				>
					{{ item.bill_name }}
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
	,
	components: {Empty, Pagination},
	props: ['Axios', 'member_info', 'TOKEN', 'codes']
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