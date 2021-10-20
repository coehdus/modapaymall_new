<template>
	<div
		class="bottom justify-space-between text-center box-shadow-top position-relative bg-base position-relative"
	>
		<span
			class="flex-1 ptb-10 flex-column"
			@click="onSide"
		>
			<v-icon
				class="color-base"
			>mdi mdi-menu</v-icon>
		</span>

		<span
			class="flex-1 ptb-10 flex-column"
			:class="{on: is_home}"
			@click="toHome"
		>
			<v-icon
				class="color-base"
			>mdi mdi-home-outline</v-icon>
		</span>

		<span
			class="flex-1 ptb-10 flex-column"
			@click="toMyPage"
			:class="{on: is_mypage}"
		>
			<v-icon
				class="color-base"
			>mdi mdi-account-outline</v-icon>
		</span>
		<span
			class="flex-1 ptb-10 flex-column position-relative"
			@click="toCart"
			:class="{on: is_cart}"
		>
			<v-icon
				class="color-base"
			>mdi mdi-cart-outline</v-icon>
			<span
				v-if="cart_cnt"
				class="cart-count "
			>{{ cart_cnt }}</span>
		</span>
		<span
			v-if="false"
			class="flex-1 ptb-10 flex-column"
			@click="toOrderList"
			:class="{on: is_delivery}"
		>
			<v-icon>mdi mdi-truck-fast</v-icon>
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
			,onSide: function(){
				this.$emit('toggleSide')
			}
		}
	}
</script>

<style>

	.on { background-color: #eee; color: #fefefe;}
	.on i { color: #333 !important;}
</style>