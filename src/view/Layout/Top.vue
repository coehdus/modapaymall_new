<template>
	<div>
		<div
			class="logo-position pa-20 text-center bg-fe"
			@click="toMain"
		>
			<img src="@/assets/images/delimall/logo.png" style="width: 40%"/>
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
	}
</script>