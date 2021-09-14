<template>
	<div class="full-height flex-xl-column">
		<template
			v-if="items.length > 0"
		>
			<ul>
				<li
					v-for="item in items"
					:key="'item_' + item.uid"
				>
					<div
						class="justify-space-between"
					>
						{{ item.b_title }}
						{{ item.wDate }}
					</div>
					<div>
						{{ item.content }}
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
	name: 'QnAList'
	,props: ['Axios', 'TOKEN']
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
				,b_code: 'b_qna'
				,is_ajax: true
			}
			,items: [

			]
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