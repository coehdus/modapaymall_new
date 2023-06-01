<template>
	<div class="full-height flex-column ">
		<div
			class="bg-title position-relative justify-space-between bg-white"
		>
			<button
				:title="program.name"
				@click="$emit('close')"
			><v-icon large class="">mdi-chevron-left</v-icon><span class=" font-weight-bold size-em-15 vertical-middle">{{ program.name }}</span></button>

		</div>
		<div
			class="pa-10 mt-10 bg-white"
		>
			<div class="justify-space-between ">
				<input
					v-model="item.shipping_name"
					placeholder="배송지명"
					class="input-box flex-3 mr-10"
					maxlength="20"
				/>
				<label
					class="pa-10 btn-default "
					:class="{'btn-success': item.is_base == 1}"
				>
					<v-icon
						v-if="item.is_base == 1"
						class="color-white"
						@click="item.is_base = 0"
					>mdi mdi-checkbox-marked-outline</v-icon>
					<v-icon
						v-else
						@click="item.is_base = 1"
					>mdi mdi-checkbox-blank-outline</v-icon>
					기본 배송지
				</label>

			</div>
			<div
				class="mt-10"
			>
				<input
					v-model="item.name"
					placeholder="받는분 이름"
					class="input-box"
					maxlength="20"
				/>
			</div>
			<div
				class="mt-10"
			>
				<input
					v-model="item.tell"
					placeholder="받는분 연락처"
					class="input-box"
					type="number"
					:rules="[rules.max(item, 'tell', 15)]"
				/>
			</div>
			<div
				class="mt-10 justify-space-between"
				@click="daumPost"
			>
				<input
					v-model="item.post"
					placeholder="우편번호"
					class="input-box flex-1"
					type="number"
					:rules="[rules.max(item, 'post', 6)]"
					readonly
				/>
				<button
					class="btn-primary flex-1 ml-10"
				>주소 검색</button>
			</div>
			<div
				class="mt-10"
			>
				<input
					v-model="item.addr1"
					placeholder="주소"
					class="input-box"
					readonly
					maxlength="80"
				/>
			</div>
			<div
				class="mt-10"
			>
				<input
					v-model="item.addr2"
					placeholder="상세주소"
					class="input-box"
					maxlength="80"
				/>
			</div>
		</div>

		<div
			class="mt-auto"
		>
			<button
				class="btn btn-identify"
				@click="save"
			>배송지 등록</button>
		</div>



		<DaumPost
			:overlay="is_daum_post"
			@callBack="addPost"
		></DaumPost>
	</div>
</template>

<script>
	import DaumPost from "../../components/Daum/DaumPost";

	export  default{
		name: 'ShippingItem'
		,
		components: { DaumPost},
		props: ['Axios', 'item', 'member_info', 'rules']
		,data: function(){
			return {
				program: {
					name: '배송지 관리'
					,top: false
					,title: false
					,bottom: false
				}
				,is_daum_post: false
			}
		}
		,methods:{
			save: async function(){
				try {
					const result = await this.Axios({
						method: 'post'
						,url: 'member/postShippingItem'
						,data: this.item
					})

					if(result.success){
						this.$emit('close')
						this.$bus.$emit('notify', { type: 'success', message: result.message})
					}else{
						this.$bus.$emit('notify', { type: 'error', message: result.message})
					}
				}catch (e){
					this.$bus.$emit('notify', { type: 'error', message: e})
				}
			}
			,daumPost: function () {
				this.is_daum_post = true
			}
			, addPost: function (call) {

				this.$set(this.item, 'post', call.zonecode)
				this.$set(this.item, 'addr1', call.address)

				this.is_daum_post = false
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
		}
	}
</script>