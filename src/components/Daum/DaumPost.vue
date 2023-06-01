<template>

	<div
		v-if="overlay"
		style="position: fixed; width: 100%; height: 100%; z-index: 9999; top: 0; left: 0; overflow: auto"
	>
		<div
			style="width: 100%; top: 0; left: 0; position: absolute; top: 0; background-color: black; color: white; height: 100%; opacity: 0.5"
		>
		</div>
		<div
			style="position: relative; z-index: 1; padding: 10px; height: 100%; overflow: auto; max-width: 480px; margin: 0 auto"
		>
			<div
				style="background-color: #0f6ecd; color: white; padding: 10px; display: flex; justify-content: space-between"
			>
				<span style="color: white; font-size: 24px" >주소 찾기</span>
				<button
					@click="daumComplate"
				><v-icon large style="color: white; ">mdi-close-box-outline</v-icon></button>
			</div>
			<VueDaumPostcode
				@complete="daumComplate"
				style="padding: 0;"
			>
			</VueDaumPostcode>
		</div>
	</div>
</template>

<script>

import { VueDaumPostcode } from "vue-daum-postcode"

export default{
	name: 'DaumPost'
	,props: ['overlay', 'config']
	,components: { VueDaumPostcode }
	,data () {
		return {
		}
	}
	,methods: {
		daumComplate: function(call){
			this.$emit('callBack', call)
		}
	}
	,watch: {
		modal: {
			deep: true
			,handler: function(call){
				// console.log('watch modal')
				if(call){
					this.callModal()
				}else{
					this.removeModal()
				}
			}
		}
	}
}
</script>