<template>
	<div
		class="header-box-menu flex-row justify-space-between bg-white"
	>
		<input
			v-model="search.search_value"
			class="flex-3 pa-10 border-right"
			type="text"
			placeholder="검색어를 입력하세요"
			@keyup.enter="toProductList"
		/>

		<i
			class="pa-10 mdi mdi-magnify size-px-24 bg-identify"
			@click="toProductList"
		></i>
	</div>
</template>

<script>
	export default {
		name: 'Search'
		,props: ['search']
		,components: {}
		,data: function(){
			return {
			}
		}
		,methods:{
			toProductList: function(){

				if(this.$storage.setQuery(this.search)) {
					this.$emit('click')
				}
			}
		}
	}
</script>