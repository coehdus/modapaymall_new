<template>
	<div
		class="bg-title position-relative justify-space-between bg-base"
	>
		<button
			v-if="!program.not_back"
			:title="program.name"
			@click="toBack()"
		><v-icon large class="color-base vertical-middle">mdi-chevron-left</v-icon><span class=" font-weight-bold size-em-15 vertical-middle color-base ">{{ program.name }}</span></button>
		<button
			v-else
			:title="program.name"
			class="flex-1"
		><span class=" font-weight-bold size-em-15 vertical-middle color-base ">{{ program.name }}</span></button>

		<span
			v-if="is_cart_view"
			class=" ptb-5 flex-column "
			@click="$emit('push', 'Cart')"
		>
			<v-icon class="mr-10">mdi mdi-cart-outline</v-icon>
			<span
				v-if="cart_cnt"
				class="cart-count "
			>{{ cart_cnt }}</span>
		</span>
	</div>
</template>

<script>
	export default{
		name: 'Title'
		,props: ['program', 'cart_cnt', 'is_cart_view']
		,methods: {
			toBack: function(){
				if(this.program.from){
					this.$router.push({ name: this.program.from })
				}else{
					this.$router.back()
				}
			}
		}
	}
</script>