<template>
	<div class="full-height flex-xl-column">
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
						:class="item_content != item.uid ? 'bg-white' : 'bg-gray'"
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
						class="top-line bg-eee"
					>
						<div class="pa-10 text-right ">{{ item.wDate }}</div>
						<div class="pa-10 top-line-dashed">{{ item.b_contents }}</div>

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
export default {
	name: 'ReviewList'
	,props: ['Axios', 'TOKEN']
	,data: function() {
		return {
			program: {
				name: '리뷰관리'
				, top: false
				, title: true
				, bottom: true
			}
			,search:{
				TOKEN: this.TOKEN
				,b_code: 'b_after'
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
	}
	,created() {
		console.log('in noticelist ')
		this.$emit('onLoad', this.program)
		this.getData()
	}
}
</script>