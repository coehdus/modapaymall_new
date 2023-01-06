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
				class="logo-position text-center "
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
						:src="$shop_logo" style="width: 40%"
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
					>{{ shop_info.shop_name }} 2</div>
					<div
						v-else
						class="color-333 size-px-16 font-weight-bold under-line"
					>{{ $production_title }} 1</div>
				</template>
			</div>
			<div
				class="flex-row justify-space-between under-line pa-10 bg-base color-white"
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
				v-if="items.length > 0"
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
			<div v-else class="text-center pa-50">등록된 카테고리가 없습니다.</div>

			<div
				class="mt-auto"
			>
				<div class="pa-10">
					<dl>
						<dt>상호명:</dt> <dd>주식회사 상생홀딩스</dd> <br/>
						<dt>대표자:</dt> <dd>정재철</dd> <br/>
						<dt>주소:</dt> <dd>대구시 동구 동부로26길 33, 3층 3호</dd><br/>
						<dt>사업자 번호:</dt> <dd>711-88-01596</dd><br/>
						<dt>통신판매번호:</dt> <dd>제2019-대구동구-0981호</dd><br/>
						<dt>의료기기판매신고번호:</dt> <dd>제2020-3420023-00065호</dd><br/>
						<dt>이메일:</dt>  <dd>ssholds@naver.com</dd><br/>
						<dt>전화번호:</dt> <dd>1833-6447</dd>
					</dl>
				</div>
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
				let auto_login = localStorage.getItem(process.env.VUE_APP_NAME + 'A')

				if(auto_login) {

					if(confirm('로그아웃시 자동로그인도 해제됩니다. 로그아웃 하시겠습니까?')) {

						localStorage.removeItem(process.env.VUE_APP_NAME + 'A')
						localStorage.removeItem(process.env.VUE_APP_NAME + 'N')
						localStorage.removeItem(process.env.VUE_APP_NAME + 'P')

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

	dt, dd { display: inline-block}
</style>