<template>
	<div class="full-height flex-xl-column ">
		<template
			v-if="items.length > 0"
		>
		<ul>
			<li
				v-for="item in items"
				:key="'item_' + item.uid"
				class="under-line"
			>
				<div
					class="pa-10 justify-space-between "
					:class="item_content != item.uid ? 'bg-gray-white' : 'bg-gray'"
					@click="item_content != item.uid ? item_content = item.uid : item_content = null"
				>
					<span>{{ item.b_title }}</span>
					<v-icon
						v-if="item_content != item.uid"
					>mdi mdi-menu-down</v-icon>
					<v-icon
						v-else
					>mdi mdi-menu-up</v-icon>
				</div>
				<div
					v-if="item_content == item.uid"
					class="bg-eee "
				>
					<div class="pa-10 justify-space-between under-line-dashed">
						<span>{{ item.m_name }}</span>
						<span>{{ item.wDate }}</span>
					</div>
					<Viewer
						v-if="item.b_contents"
						:initialValue="item.b_contents"
						class="pa-10 "
					/>
				</div>
			</li>
		</ul>

			<Pagination
				:program="program"
				:align="'center'"
				:options="search"

				@click="getSearch"

				class="mt-auto pa-10"
			></Pagination>
		</template>
		<div
			v-else
			class="full-height flex-column justify-center"
		>
			<div class="text-center">
				<v-icon
					class="size-px-48"
				>mdi mdi-cloud-off-outline</v-icon>
				<br/>
				<br/>
				<div class="font-weight-bold size-px-24">No Data</div>
			</div>
		</div>
	</div>
</template>

<script>

	import '@toast-ui/editor/dist/toastui-editor-viewer.css';
	import { Viewer } from "@toast-ui/vue-editor";
	import Pagination from "../../components/Pagination";

	export default {
		name: 'NoticeList'
		,props: ['Axios', 'TOKEN']
		,components: {Pagination, Viewer}
		,data: function() {
			return {
				program: {
					name: '공지사항'
					, top: false
					, title: true
					, bottom: true
				}
				,search:{
					b_code: this.$route.params.b_code
					,is_ajax: true
				}
				,items: [

				]
				,item_content: null
			}
		}
		,methods: {
			getData: async function(){
				this.$emit('onLoading')
				try{
					const result = await this.Axios({
						method: 'get'
						,url: 'board/getBbsList'
						,data: this.search
					})
					if(result.success){
						this.items = result.data.result
						this.$set(this.search, 'total_count', result.data.tCnt)
						this.$bus.$emit('notify', { type: 'success', message: result.message })
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}finally {
					this.$emit('offLoading')
				}
			}
			, getSearch: function(page){
				if(page){
					this.search.page = page
				}
				this.getData()
			}
		}
		,created() {
			console.log('in noticelist ')
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
</script>