<template>
	<div
		v-if="is_show"
		class="position-fixed top"
		style="bottom: 60px; right: 10px;"
	>
		<button
			@click="toTop"
			class="bg-blue radius-100"
		><v-icon large class="color-white">mdi mdi-chevron-up</v-icon></button>
	</div>
</template>

<script>
	export default {
		name: 'more'
		, props: ['body']
		, data: function(){
			return {
				is_show: false
			}
		}
		, methods: {
			toTop: function(){
				this.body.scrollTo({
					top:0,
					behavior: 'smooth',
				});
			}
		}
		, created() {
			this.body.addEventListener('scroll', () => {
				if(this.body.scrollTop > 0){
					this.is_show = true
				}else{
					this.is_show = false
				}
			})
		}
	}
</script>

<style>
	.top {
		animation: top 1s;
	}
	.hide {
		animation: hide 1s;
	}
	@keyframes top{
		0% {
			transform: translateY(200%);
		}
		100% {
			transform: translateY(0%);
		}
	}

	@keyframes hide{
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>