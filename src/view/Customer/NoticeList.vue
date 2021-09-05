<template>
	<div>
		공지사항
	</div>
</template>

<script>
	export default {
		name: 'NoticeList'
		,props: ['Axios']
		,data: function() {
			return {
				program: {
					name: '공지사항'
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