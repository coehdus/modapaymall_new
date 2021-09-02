<template>
	<div
		class="side"
	>
		<div
			class="bg-side"
			@click="toggleSide"
		></div>

		<div
			class="side-container flex-column"
		>
			<div
				class="flex-row justify-space-between under-line pa-20 bg-base color-white"
			>
				<span class="color-white">{{ member_info.member_name }} 님</span>
				<v-icon
					@click="toggleSide"
					class="color-white"
				>mdi mdi-arrow-left-bold-box-outline</v-icon>
			</div>

			<ul
				class="side-content overflow-y-auto"
			>
				<li
					v-for="item in items"
					:key="item.category_code"
					class="li-side-content justify-space-between"
					:class="'li-side-depth-' + item.depth"

					@click="toItem(item.category_code)"
				>
					<span>{{ item.category_name }}</span>
					<v-icon
					>mdi mdi-chevron-right</v-icon>
				</li>
			</ul>

			<div
				class="mt-auto"
			>
				<div
					class="text-center bg-gray pa-10"
				>
					Ver 1.0.0
				</div>
				<div>
					<button
						class="btn btn-identify"
						@click="logout"
					>로그아웃</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'Side'
		,props: ['Axios', 'member_info', 'category']
		,data: function(){
			return {
				items: this.category
			}
		}
		,methods: {
			toItem: function(category){
				this.toggleSide()
				//document.location.href = '/Product/List/' + category
				this.$emit('push', 'ProductList', { category: category})
			}
			,toggleSide: function(){
				this.$emit('toggleSide')
			}
			,logout: function(){
				if(confirm('로그아웃 하시겠습니까?')){
					sessionStorage.removeItem('delimallT')
					sessionStorage.removeItem('delimallT2')
					document.location.href= '/Login'
				}
			}
		}
		,created: function(){
		}
	}
</script>

<style>

	.side {
		width: 100%; height: 100%;
		position: fixed; left: 0; top: 0; z-index: 98;
	}
	.bg-side {
		width: 100%; height: 100%;
		position: fixed; left: 0; top: 0; z-index: 98;
		background-color: gray;
		opacity: 0.5;
	}
	.side-container{
		width: 80%; height: 100%;
		max-width: 300px;
		position: relative;  z-index: 99;
		background-color: white;
		overflow-y: auto;
	}

	.side-container {

	}

	.li-side-content {
		padding: 10px 10px;
		border-bottom: 1px solid #ddd;
	}
	.li-side-depth-1 {
		text-indent: 0px;
	}
	.li-side-depth-2 {
		text-indent: 10px;
	}
	.li-side-depth-3 {
		text-indent: 20px;
	}
	.li-side-depth-4 {
		text-indent: 30px;
	}
</style>