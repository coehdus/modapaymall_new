<template>
	<div
		class="full-height"
		style="overflow: hidden; background-color: #f8f8f8"
	>
		<Loading
			v-if="is_loading"
		></Loading>
		<div
			v-if="is_ready"
			class="full-height"
			style=" max-width: 480px; margin: 0 auto"
		>
		<Side
			v-if="is_side"
			:Axios="Axios"
			:member_info="member_info"
			:seller_info="seller_info"
			:category="category"

			@toggleSide="toggleSide"
			@push="toLocation"
		>
		</Side>
		<div
			class="full-height flex-column"
		>
			<Top
				v-if="program.top"
				:program="program"
				:member_info="member_info"
				:seller_info="seller_info"

				@push="toLocation"
			></Top>
			<Title
				v-if="program.title"
				:program="program"
				:cart_cnt="cart_cnt"

				@push="toLocation"
			></Title>

			<router-view
				:Axios="Axios"
				:Notify="Notify"
				:metaInfo="metaInfo"
				:rules="rules"
				:TOKEN="TOKEN"
				:cart_items="cart_items"
				:member_info="member_info"
				:seller_info="seller_info"
				:filter="filter"
				:key="$route.fullPath"
				:date="date"
				:cart_cnt="cart_cnt"
				:codes="codes"
				:category="category"
				:user="member_info"

				@setNotify="setNotify"
				@onLoad="setProgram"
				@getCartList="getCartList"

				@push="toLocation"
				@toBack="toBack"
				@onLoading="onLoading"
				@offLoading="offLoading"
				class=" overflow-y-auto"
			></router-view>

			<Bottom
				v-if="program.bottom"

				:cart_cnt="cart_cnt"
				@push="toLocation"
				@toggleSide="toggleSide"
			></Bottom>
		</div>
		</div>

		<Notify
			:msg="notifyCondition.message"
			:type="notifyCondition.type"

			@clearMsg="clearMsg"
		/>
	</div>
</template>

<script>

	import Notify from '@/components/AlertMsg'
	import Side from "@/view/Layout/Side";
	import Top from "@/view/Layout/Top";
	import Bottom from "@/view/Layout/Bottom";
	import Title from "@/view/Layout/Title";
	import Loading from "@/view/Layout/Loading";
	
	export default{
		name: 'Layout'
		,props: ['Axios', 'Notify', 'metaInfo', 'rules', 'TOKEN', 'member_info', 'seller_info', 'filter', 'date', 'codes']
		,components: {Loading, Title, Bottom, Side, Top, Notify }
		,data: function(){
			return {
				program: {
				}
				,notifyCondition: {
					message: '메시지 입니다'
					,type: ''
				}
				,is_side: false
				,cart_items: [

				]
				,is_loading: true
				,is_ready: false
				,category: null
			}
		}
		,computed:{
			cart_cnt: function(){
				return this.cart_items.length
			}
		}
		,methods: {

			getData: async function(){
				try{
					const result = await this.Axios({
						method: 'get'
						,url: '/product/getCategory'
					})
					if(result.success){
						this.category = result.data.category
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message})
					}
				}catch (e) {
					this.$bus.$emit('notify', { type: 'error', message: e})
				}
			}
			,setNotify: function({type, message}){
				this.notifyCondition = {
					message: message
					,type: type
				}
			}
			,clearMsg: function(){
				this.notifyCondition.message = ''
			}
			,toggleSide: function(){
				this.is_side = !this.is_side
			}
			,setProgram: function(program){
				this.program = program
			}
			,getCartList: async function(){
				try{
					const result = await this.Axios({
						method: 'get'
						,url: 'order/getCartList'
						,data: {
							TOKEN: sessionStorage.getItem(process.env.VUE_APP_NAME + 'T')
						}
					})

					if(result.success){
						this.cart_items = result.data.content.result
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message})
					}
				}catch (e) {
					this.$bus.$emit('notify', { type: 'error', message: e})
				}
			}
			,toBack: function(){
				this.$router.back()
			}
			,toLocation: function( {name, params, query}){
				this.$router.push({ name: name, params: params, query: query}).catch(function(e){
					console.log(e)
				});
			}
			,onLoading: function(){
				this.is_loading = true
			}
			,offLoading: function(){
				setTimeout(() => {
					this.is_loading = false
				}, 300)
			}
		}
		,created: function(){
			this.getCartList()
			this.getData()

			this.$bus.$on('on', (type) =>{
				if(type){
					this.onLoading()
				}else{
					this.offLoading()
				}
			})
		}
		,watch: {
			'codes.P002': {
				immediate: true
				,deep: true
				,handler: function(call){
					let skip = false
					let except = ['auth']
					let path = document.location.href

					except.forEach(function (val) {
						if (path.toLowerCase().indexOf(val) > -1) {
							skip = true
							return false
						}
					})

					if(call || skip){
						this.is_ready = true
						setTimeout(() => {
							this.is_loading = false
						}, 500)
					}else{
						this.is_ready = false
						this.is_loading = true
					}
				}
			}
		}
	}
	
</script>

<style lang="css" src="@/assets/css/reset.css"></style>
<style lang="css" src="@/assets/css/template.css"></style>
<style lang="css" src="@/assets/css/base.css"></style>

<style>

.cart-count {
	position: absolute;
	right: 10px;
	top: 5px;
	background-color: #0093e2;
	border: 1px solid #ddd;
	border-radius: 5px;
	color: white;
	font-size: 12px;
	padding: 3px 5px;
	line-height: 100%;
}


.company-list {
	font-family: "\B9D1\C740 \ACE0\B515",Malgun Gothic,Apple-Gothic,Helvetica,Dotum,\\B3CB\C6C0,Gulim
}

.cart-none-list {
	display: none;
}

.main-box-pdt { background-color: white; }
.main-box-pdt img { }

.box-shadow-top { box-shadow: 0px 3px 6px black}
.box-shadow-inset { box-shadow: 0px 0px 2px 1px #bbb inset}
.box-shadow { box-shadow: 1px 1px 3px 1px #bbb}

.border-tb { border-top: 1px solid #ddd; border-bottom: 1px solid #ddd;}
.border-lr { border-left: 1px solid #ddd; border-right: 1px solid #ddd;}
.border-right { border-right: 1px solid #ddd}

.bg-base { background-color: black}

	.logo-position {
		max-height: 200px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20px 0;
		background-color: white;
	}
	.header-box-menu {
		border-bottom: 1px solid #ddd;
	}

	.icon-box {
		padding: 5px;
		border: 1px solid #ddd;
	}

	.bg-title {
		padding: 10px;
		box-shadow: 0 0 3px 1px gray;
	}
</style>