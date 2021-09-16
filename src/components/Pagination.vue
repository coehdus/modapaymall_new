<template>
	<div :class="'text-' + align">
		<div
			v-if="type == 'more'"
		>
			<div
				v-if="page_config.page < page_config.total_page"
				class="pa-10 box bg-white box-shadow "
				@click="click(nextPage)"
			>더 보기</div>
		</div>
		<div
			v-else
			class="pagination mt-10"
		>
			<div class="mt-10 justify-center">
				<div class="pg-prev  mr-10 ">
					<v-icon
						class="box color-icon bg-white"
						@click="click(prevGroup)"
					>mdi mdi-chevron-left</v-icon>
				</div>
				<div class="">
					<button

						v-for="item in (setLength)"
						class="box prl-10 mr-10 bg-page size-px-14 bg-white"
						style="line-height: 170%"
						:class="{ active: page_config.page == page_config.page_group * page_config.page_cnt - page_config.page_cnt + item}"
						:key="item"
						@click="click(page_config.page_group * page_config.page_cnt - page_config.page_cnt + item)"

					>{{ page_config.page_group * page_config.page_cnt - page_config.page_cnt + item }}</button>
				</div>
				<div class="pg-next">
					<v-icon
						class="box color-icon bg-white"
						@click="click(nextGroup)"
					>mdi mdi-chevron-right</v-icon>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'Pagination'
		,props: ['program', 'options', 'align', 'type']
		,data: function(){
			return {
				page_config: {
					page: 1
					,page_group: 1
					,total_count: 1
					,list_cnt: 10
					,page_cnt: 5
					,total_page: 1
					,total_group: 1
				}
			}
		}
		,computed: {
			setLength: function(){
				let length = 
					this.page_config.total_group > this.page_config.page_group ?
					this.page_config.page_cnt : this.page_config.total_page - ((this.page_config.page_group - 1)* this.page_config.page_cnt)
				
				if(length <= 0){
					length = 1
				}
				return length
			}
			,prevGroup: function(){
				let prev = (this.page_config.page_group - 1) * this.page_config.page_cnt
				if(prev <= 0){
					prev = 1
				}
				return prev
			}
			,nextGroup: function(){
				let next = this.page_config.page_group * this.page_config.page_cnt + 1
				if(next >= this.page_config.total_page){
					next = this.page_config.total_page
				}
				return next
			}
			,nextPage: function(){
				let page = this.page_config.page + 1

				return page
			}
		}
		,methods: {
			click: function(page){
				this.$set(this.options, 'page', page)
				this.$emit('click', page)
				//this.$router.push(this.options.link + page)
			}
		}
		,watch: {
			options: {
				deep: true
				,immediate: true
				,handler: function(call){
//					console.log('page_config')
//					console.log(call)
					if(call.page){
						this.page_config.page = call.page
					}
					if(call.total_count >= 0){
						this.page_config.total_count = call.total_count
					}
					if(call.list_cnt){
						this.page_config.list_cnt = call.list_cnt
					}
					if(call.page_cnt){
						this.page_config.page_cnt = call.page_cnt
					}
					if(call.link){
						this.page_config.link = call.link
					}
					
					let total_page = Math.ceil(this.page_config.total_count / this.page_config.list_cnt)
					total_page = total_page > 0 ? total_page : 1
					this.page_config.total_page = total_page
					
					let total_group = Math.ceil(total_page / this.page_config.page_cnt)
					total_group = total_group > 0 ? total_group : 1
					this.page_config.total_group = total_group
					
					let page_group = Math.ceil(this.page_config.page / this.page_config.page_cnt)
					this.page_config.page_group = page_group
					page_group = page_group > 0 ? page_group : 1
				}
			}
		}
	}
</script>

<style>
.active {
	background-color: #333 !important;
	color: #eee;
}
</style>