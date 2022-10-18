
<template>
	<transition
		name="fade"
	>
		<div
			style="position: fixed; min-height: 80px; width: 100%; right: 0; bottom: 0; z-index: 9999999; "
			:style="bottom"
			v-show="notify"

			@click="clear"
		>
			<div
				style="position: absolute; width: 100%; height: 100%; background-color: black; opacity: 0.8"
			></div>
			<div
				style="position: relative; min-height: 80px; z-index: 9999998; padding: 10px; font-size: 14px; display: flex; flex-direction: column; justify-content: center;"
				:class="type"
			>
				<div
					style=" padding: 10px; border-radius: 10px; color: #eee; text-align: right"
					@click="clear"
				>
					{{ msg }}
					<v-alert
						v-if="false"
						:type="type ? type : 'error'"
						dense
					>

					</v-alert>
				</div>
			</div>
		</div>
	</transition>

</template>

<script>

export default{
	name: 'AlertMsg'
	,props: []
	,data: () => ({
		notify: false
		,msg: '!!'
		,type: ''
		,config: {

		}
	})
	,watch: {
		msg: {
			handler: function(call){
				if(call){
					this.notifyMsg()
					this.notify = true
				}
			}
		}
	}
	, computed: {
		bottom: function(){
			let t = 'bottom: 0'

			if(this.config){
				t = 'bottom: ' + this.config.bottom
			}
			return t
		}
	}
	,methods: {
		clear: function(){
			this.notify = false
			this.msg = ''
			this.$emit('clearMsg')
		}
		, notifyMsg: function(){

			let timer = this.notifyMsg.timer
			if (timer) {
				clearTimeout(timer)
			}

			this.notifyMsg.timer = setTimeout(() => {
				this.clear()
			}, 4000)

			this.elapse = 1
			let t = this.notifyMsg.t
			if (t) {
				clearInterval(t)
			}

			this.notifyMsg.t = setInterval(() => {
				if (this.elapse === 3) {
					this.elapse = 0
					clearInterval(this.notifyMsg.t)
				}
				else {
					this.elapse++
				}
			})
		}
	}

	,created() {
		let self = this
		this.$bus.$on('notify', function({ type, message, config }){
			console.log('config', config)
			self.msg = message
			self.type = type
			self.config = config
		})
	}
}
</script>


<style>

.slide-fade-enter-active {
	transition: all .3s ease;
}
.slide-fade-leave-active {
	transition: all .0s ease;
}
.slide-fade-enter{
	transform: translateY(100%);

	overflow: hidden;
	height: 100%;
}
.slide-fade-leave, .slide-fade-leave-to {
	transform: translateY(100%) ;
	opacity: 0;
	overflow: hidden;
}

.success { color: #eee !important;}

</style>