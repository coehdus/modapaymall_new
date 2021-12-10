<template>
	<div>
		<div
			class="logo-position pa-20 text-center bg-fe"
			@click="toMain"
		>
			<img
				v-if="$production"
				src="@/assets/images/delimall/logo.png" style="width: 40%"
			/>
			<span
				v-else
				class="color-333 size-px-16 font-weight-bold"
			>{{ $production_title }}</span>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'Top'
		,methods: {
			onSide: function(){
				this.$emit('toggleSide')
			}
			,toMain: function(){
				this.$emit('push', 'Index')
			}
		}
		,created() {
			console.log(this.$production_title)
		}
	}
</script>