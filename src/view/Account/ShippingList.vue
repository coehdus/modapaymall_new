<template>
	<div class="full-height bg-gray-light">
		<div
			v-if="!is_item"
			class="full-height"
		>
			<div
				class="bg-title position-relative justify-space-between bg-white"
			>
				<button
					:title="program.name"
					@click="$router.back()"
				><v-icon large class="">mdi-chevron-left</v-icon><span class=" font-weight-bold size-em-15 vertical-middle">{{ program.name }}</span></button>
				<v-icon
					class="color-blue"
					@click="setItem(item)"
				>mdi mdi-pencil-box</v-icon>
			</div>
			<ul
				class="pa-10"
			>
				<li
					v-for="item in item_list"
					:key="item.uid"

					class="pa-10 box-shadow mb-10 bg-white"
				>
					<div
						class="ptb-10 justify-space-between under-line-dashed"
					>
						<span
							:class="{ 'color-green font-weight-bold': item.is_base == 1 }"
						>{{ item.shipping_name }}</span>
						<span>
							<v-icon
								class="color-blue"
								@click="setItem(item)"
							>mdi mdi-pencil-box</v-icon>
							<v-icon
								class="color-red"
								@click="showRemoveModal(item)"
							>mdi mdi-close-box-outline</v-icon>
						</span>
					</div>
					<div class="ptb-10  justify-space-between under-line-dashed">
						<span>{{ item.name }}</span>
						<span>{{ item.tell }}</span>
					</div>

					<div class="ptb-10">{{ item.post }} {{ item.addr1 }} </div>
					<div class="">{{ item.addr2 }}</div>
				</li>
			</ul>

			<Modal
				:is_modal="is_modal"
				:option="modal_option"
			>
				<div
					slot="modal-content"
					class="full-height flex-column justify-center text-center size-px-16"
				><span>배송지 <span class="font-weight-bold">{{ item_remove.shipping_name }}</span>를 <span class="color-red">삭제</span>하시겠습니까?</span></div>
				<div
					slot="modal-bottom"
					class=" justify-space-between"
					@click="removeItem"
				>
					<button
						class="pa-10 btn-danger flex-1"
					>삭제</button>
					<button
						class="pa-10 btn-default flex-1"
						@click="is_modal = !is_modal"
					>취소</button>
				</div>
			</Modal>

		</div>

		<ShippingItem
			v-if="is_item"
			:Axios="Axios"
			:item="item"
			:rules="rules"

			@close="close"
			@onLoad="onLoad"
			@setNotify="setNotify"
		></ShippingItem>
	</div>
</template>

<script>
	import ShippingItem from "./ShippingItem";
	import Modal from "../../components/Modal";
	export default{
		name: 'Shipping'
		,
		components: {Modal, ShippingItem},
		props:['Axios', 'member_info', 'rules', 'TOKEN']
		,data: function(){
			return {
				program: {
					name: '주소록'
					,top: false
					,title: false
					,bottom: true

				}
				,search: {
					TOKEN: this.TOKEN
				}
				,items: []
				,item: {
					is_base: ''
					,TOKEN: this.TOKEN
				}
				,item_remove: {
					TOKEN: this.TOKEN
				}
				,is_item: false
				,is_modal: false
				,modal_option: {
					title: true
					,bottom: true
				}
			}
		}
		,computed: {
			item_list: function(){
				const self = this
				return this.items.filter(function (item){
					item.TOKEN = self.TOKEN
					if(item.is_base != 1){
						item.is_base = ''
					}
					return item
				})
			}
		}
		,methods: {
			getData: async function(){
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'member/getShippingList'
						,data: this.search
					})
					if(result.success){
						this.items = result.data
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message})
					}
				}catch (e) {
					console.log(e)
				}
			}
			,close: function(){
				this.is_item = false
				this.item = {
					is_base: ''
					,TOKEN: this.TOKEN
				}
				this.getData()
				this.$emit('onLoad', this.program)
			}
			,onLoad: function(program){
				this.$emit('onLoad', program)
			}
			,setNotify: function({ type, message}){
				this.$emit('setNotify', { type: type, message: message })
			}
			,setItem: function(item){
				this.item = item
				this.is_item = true
			}
			,showRemoveModal: function(item){
				this.item_remove = item
				this.is_modal = true
			}
			,removeItem: async function(){
				try{
					const result = await this.Axios({
						method: 'post'
						,url: 'member/removeShippingItem'
						,data: this.item_remove
					})

					if(result.success){
						this.is_modal = false
						this.item_remove = {}
						await this.getData()
					}else{
						this.$emit('setNotify', { type: 'error', message: result.message })
					}
				}catch (e) {
					console.log(e)
				}
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
			this.getData()
		}
	}
</script>