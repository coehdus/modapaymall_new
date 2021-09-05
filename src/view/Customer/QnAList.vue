<template>
	<div>
		1:1문의
	</div>
</template>

<script>
export default {
	name: 'QnAList'
	,props: ['Axios']
	,data: function() {
		return {
			program: {
				name: '1:1문의'
				, top: false
				, title: true
				, bottom: true
			}
		}
	}

	,created() {
		this.$emit('onLoad', this.program)
	}
}
</script>