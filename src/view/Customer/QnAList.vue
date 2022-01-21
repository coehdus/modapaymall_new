<template>
	<div class="full-height flex-xl-column ">
		<div class="justify-space-between overflow-hidden" >
			<input
				v-model="search.search_value"
				class="box vertical-middle flex-1 pa-10"
				placeholder="검색어를 입력하세요"
				/>
			<v-icon
				class="box vertical-middle color-green pa-5-10"
				@click="getData"
			>mdi mdi-magnify</v-icon>
			<v-icon
				class="box vertical-middle color-blue pa-5-10"
				@click="toItem"
			>mdi mdi-pencil</v-icon>
		</div>
		<template
			v-if="items.length > 0"
		>
			<ul>
				<li
					v-for="item in item_list"
					:key="'item_' + item.uid"
					class="under-line"
				>
					<div
						class="pa-10 justify-space-between "
						:class="item_content != item.uid ? 'bg-white' : 'bg-gray'"
						@click="item_content != item.uid ? item_content = item.uid : item_content = null"
					>
						<span>[<span :class="item.is_answer_color">{{ item.is_answer_name }}</span>] {{ item.b_title }}</span>
						<v-icon
							v-if="item_content != item.uid"
						>mdi mdi-menu-down</v-icon>
						<v-icon
							v-else
						>mdi mdi-menu-up</v-icon>
					</div>
					<div
						v-if="item_content == item.uid"
						class="bg-eee"
					>
						<div class="pa-10 justify-space-between under-line-dashed">
							<span>{{ item.m_name }}</span>
							<span>{{ item.wDate }}</span>
						</div>
						<Viewer
							v-if="item.b_contents"
							:initialValue="item.b_contents"
							class="pa-10"
						/>
					</div>
				</li>
			</ul>
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

export default {
	name: 'QnAList'
	,props: ['Axios', 'TOKEN']
	,components: { Viewer}
	,data: function() {
		return {
			program: {
				name: '1:1문의'
				, top: false
				, title: true
				, bottom: true
			}
			,search:{
				TOKEN: this.TOKEN
				,b_code: this.$route.params.b_code
				,is_ajax: true
			}
			,items: [

			]
			,item_content: null
		}
	}

	,computed: {
		item_list: function(){
			return this.items.filter(function(item){
				if(item.b_answer){
					item.is_answer_color = 'font-weight-bold'
					item.is_answer_name = '답변 완료'
				}else{
					item.is_answer_color = ''
					item.is_answer_name = '답변 대기'
				}
				return item
			})
		}
	}
	,methods: {
		getData: async function(){
			try{
				this.$emit('onLoading')
				const result = await this.Axios({
					method: 'get'
					,url: 'board/getBbsList'
					,data: this.search
				})
				if(result.success){
					this.items = result.data.result
					this.$set(this.search, 'total_count', result.data.tCnt)
					this.$emit('setNotify', { type: 'success', message: result.message })
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch (e) {
				console.log(e)
			}finally {
				this.$emit('offLoading')
			}
		}
		,toItem: function(){
			this.$emit('push', { name: 'BbsItem', params: { b_code: this.search.b_code }})
		}
	}
	,created() {
		console.log('in noticelist ')
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>