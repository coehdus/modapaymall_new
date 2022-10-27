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
				class="bg-black text-center color-white"
			>
				<template
					v-if="$production"
				>
					<img
						v-if="shop_info.shop_logo"
						:src="shop_info.shop_logo"
						class="shop-logo"
					/>
					<div
						v-else-if="shop_info.shop_name"
						class="pa-20 size-px-16 font-weight-bold  under-line-82"
					>{{ shop_info.shop_name }}</div>
					<img
						v-else
						src="@/assets/images/delimall/logo.png" style="width: 40%"
					/>
				</template>
				<template
					v-else
				>
					<img
						v-if="shop_info.shop_logo"
						:src="shop_info.shop_logo"
						class="shop-logo"
					/>
					<div
						v-else-if="shop_info.shop_name"
						class="pa-20 size-px-16 font-weight-bold  under-line-82"
					>{{ shop_info.shop_name }}</div>
					<div
						v-else
						class="color-333 size-px-16 font-weight-bold under-line"
					>{{ $production_title }}</div>
				</template>
			</div>
			<div
				class="flex-row justify-space-between under-line pa-20-10 bg-base color-white"
			>
				<span class="color-white">
					{{ member_info.member_name }} 님

					<button
						class="size-px-10 box prl-10 bg-gray color-eee ml-10 line-height-160"
						@click="logout"
					>로그아웃</button>
				</span>

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
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'Side'
		,props: ['Axios', 'member_info', 'category', 'shop_info']
		,data: function(){
			return {
				items: this.category
			}
		}
		,methods: {
			toItem: function(category){
				this.toggleSide()

				this.$storage.setQuery({ pdt_category: category})
				this.$storage.push({ name: 'ProductList', params: { category: category} })
			}
			,toggleSide: function(){
				this.$emit('toggleSide')
			}
			,logout: function(){
				let auto_login = localStorage.getItem('delimallA')

				if(auto_login) {

					if(confirm('로그아웃시 자동로그인도 해제됩니다. 로그아웃 하시겠습니까?')) {

						localStorage.setItem('delimallA', false)
						localStorage.removeItem('delimallA')
						localStorage.removeItem('delimallN')
						localStorage.removeItem('delimallP')

						sessionStorage.removeItem(process.env.VUE_APP_NAME + 'T')
						sessionStorage.removeItem(process.env.VUE_APP_NAME + 'T2')
						document.location.href= '/Login'
					}

				}else{

					if(confirm('로그아웃 하시겠습니까?')){
						sessionStorage.removeItem(process.env.VUE_APP_NAME + 'T')
						sessionStorage.removeItem(process.env.VUE_APP_NAME + 'T2')
						document.location.href= '/Login'
					}
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