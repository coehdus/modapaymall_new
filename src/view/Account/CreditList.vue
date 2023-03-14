<template>
	<div class="full-height bg-gray-light">
		<div
			class="full-height flex-column"
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
					@click="toCredit"
				>mdi mdi-pencil-box</v-icon>
			</div>
			<ul
				v-if="items_credit.length > 0"
				class="pa-10"
			>
				<li
					v-for="item in items_credit"
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

			<div
				v-else
				class="full-height flex-column justify-center overflow-y-auto"
			>
				<div class="text-center">
					<v-icon
						large
						class="color-base size-px-48"
					>mdi mdi-cloud-off-outline</v-icon>
					<p class="mt-20">등록된 신용카드가 없습니다.</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'CreditList'
		, props: ['member_info', 'Axios']
		, data: function(){
			return {
				program: {
					name: '신용카드관리'
					,code: 'mypage'
					,wrap: 'mypage'
					,top: false
					,title: false
					,bottom: true
					,class: 'blue'
				}
				, items_credit: []
				, item_more: {}
				, is_more: false
			}
		}
		, computed: {

		}
		, methods: {
			getCreditList: async function(){
				try{
					this.$bus.$emit('on', true)
					let result = await this.Axios({
						method: 'get'
						,url: '/order/getCreditList'
					})
					if(result.success){
						this.items_credit = result.data
					}else{
						throw result.message
					}
				}catch(e){
					console.log(e.message)
					this.$bus.$emit('notify', { type: 'error', message: e})
				}finally {
					this.$bus.$emit('on', false)
				}
			}
			, toCredit: function(){
				this.$emit('push', { name: 'CreditRegister'})
			}
		}
		, created() {
			this.$emit('onLoad', this.program)
			this.getCreditList()
		}
	}
</script>