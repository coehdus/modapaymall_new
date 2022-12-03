<template>
	<div
		class="full-height flex-column justify-center bg-error"
	>
		
		<div 
			class="text-white text-center size-px-20"
		>
			<div class="text-center">
				<v-icon
					class="color-red size-px-36"
				>mdi-alert-outline</v-icon>
			</div>
			<div
				class="pa-10"
			>존재하지 않는 페이지입니다</div>
			<div
				class="pa-10"
			>확인 후 다시 이용해주세요.</div>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'ErrorNetwork'
		,data: function(){
			return {
				program: {
					name: "Not Found Page"
					,title: true
					,bottom: false
				}
			}
		}
		,created: function(){
			this.$emit('onLoad', this.program)
		}
	}
</script>

<style>
	.bg-error {background-color: #15324E !important; color: white; text-align: center;}
	.fill-height {height: 100%; width: 100%;}
</style>