<template>
	<div>
			리뷰 관리
	</div>
</template>

<script>
export default {
	name: 'ReviewList'
	,props: ['Axios']
	,data: function() {
		return {
			program: {
				name: '리뷰관리'
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