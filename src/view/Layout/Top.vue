<template>
	<div class="under-line">
		<div
			class="logo-position text-center bg-fe"
			@click="toMain"
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
					class="pa-20 color-333 size-px-16 font-weight-bold"
				>{{ shop_info.shop_name }}</div>
				<img
					v-else
					src="@/assets/images/delimall/logo.jpg" style="width: 40%"
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
					class="pa-20 color-333 size-px-16 font-weight-bold"
				>{{ shop_info.shop_name }}</div>
				<span
					v-else
					class="color-333 size-px-16 font-weight-bold"
				>{{ $production_title }}</span>
			</template>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'Top'
		, props: ['member_info', 'shop_info']
		,methods: {
			onSide: function(){
				this.$emit('toggleSide')
			}
			,toMain: function(){
				this.$storage.push({name: 'Index', not_query: false})
			}
		}
		,created() {
		}
	}
</script>

<style>
	.shop-logo { width: 100%;}
</style>