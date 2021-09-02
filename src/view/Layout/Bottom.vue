<template>
	<div
		class="bottom justify-space-between text-center box-shadow-top position-relative bg-white position-relative"
	>
		<span
			class="flex-1 ptb-10 flex-column"
			:class="{on: is_home}"
			@click="toHome"
		>
			<v-icon
			>mdi mdi-store</v-icon>
			홈
		</span>
		<span
			class="flex-1 ptb-10 flex-column position-relative"
			@click="toCart"
			:class="{on: is_cart}"
		>
			<v-icon>mdi mdi-cart-outline</v-icon>
			장바구니
			<span
				v-if="cart_cnt"
				class="cart-count "
			>{{ cart_cnt }}</span>
		</span>
		<span
			class="flex-1 ptb-10 flex-column"
			@click="toOrderList"
			:class="{on: is_delivery}"
		>
			<v-icon>mdi mdi-truck-fast</v-icon>배송조회
		</span>
		<span
			class="flex-1 ptb-10 flex-column"
			@click="toMyPage"
			:class="{on: is_mypage}"
		>
			<v-icon>mdi mdi-account-settings</v-icon>마이페이지
		</span>
	</div>
</template>

<script>
	export default{
		name: 'Bottom'
		,props: ['cart_cnt']
		,data: function(){
			return {

			}
		}
		,computed: {
			is_home: function(){
				if(this.$route.path == '/Index'){
					return true
				}else{
					return false
				}
			}
			,is_cart: function(){
				if(this.$route.path == '/Cart'){
					return true
				}else{
					return false
				}
			}
			,is_delivery: function(){
				if(this.$route.path == '/Order/List'){
					return true
				}else{
					return false
				}
			}
			,is_mypage: function(){
				if(this.$route.path.indexOf('/Account') > -1){
					return true
				}else{
					return false
				}
			}
		}
		,methods: {
			toHome: function(){
				this.$emit('push', 'Index')
			}
			,toMyPage: function(){
				this.$emit('push', 'MyPage')
			}
			,toCart: function(){
				this.$emit('push', 'Cart')
			}
			,toOrderList: function (){
				this.$emit('push', 'OrderList')
			}
		}
	}
</script>

<style>
	.on { background-color: black; color: white;}
	.on i { color: white !important;}
</style>