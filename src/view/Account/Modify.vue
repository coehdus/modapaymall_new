<template>
	<div
		class="flex-column full-height"
	>
		<Title
			:program="program"
		></Title>

		<div
			class="pa-10 flex-column full-height overflow-y-auto bg-gray-light"
		>
			<div>
				<div class="justify-space-between">
					<h6 class="pa-10 ">내 정보</h6>
				</div>
				<ul
					class="box-mypage-list shadow ul-under-line size-px-14 bg-white"
				>
					<li
						class="pa-10 justify-space-between"
					>
						<span>아이디</span>
						<span>{{ member_info.member_id }}</span>
					</li>
					<li
						class="pa-10 justify-space-between"
					>
						<span>이름</span>
						<span>{{ member_info.member_name }}</span>
					</li>
					<li
						class="pa-10 justify-space-between"
					>
						<span>연락처</span>
						<span>
							<input
								v-model="item.member_tell"
								type="number" placeholder="연락처를 입력하세요"
								class="box prl-10"
								:rules="[rules.max(item, 'member_tell', 12)]"
							/>
						</span>
					</li>
					<li
						class="pa-10 justify-space-between"
					>
						<span>이메일</span>
						<span>
							<input
								v-model="item.member_email"
								placeholder="이메일을 입력하세요"
								class="box prl-10"
								:rules="[rules.max(item, 'member_email', 50)]"
							/></span>
					</li>
					<li
						class="pa-10 justify-space-between"
					>
						<span>기본 주소</span>
						<span class="">
							<button
								class="bg-identify prl-10"
								@click="daumPost('default')"
							>주소 검색</button>
						</span>
					</li>
					<li class="pa-10 text-right">
						<span>
							<input
								v-model="item.member_post"
								type="number" placeholder="우편번호"
								class="box prl-10"
								readonly

								:rules="[rules.numeric(item, 'member_post', 10)]"
							/>
						</span>
					</li>
					<li class="pa-10 " >
						<div class=" text-right">
							<input
								v-model="item.member_addr1"
								type="text" placeholder="기본 주소"
								class="box prl-10"
								readonly
								maxlength="80"
							/>
						</div>
					</li>
					<li class="pa-10 " >
						<div class=" text-right">
							<input
								v-model="item.member_addr2"
								type="text" placeholder="상세 주소"
								class="box prl-10"
								maxlength="80"
							/>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div>
			<button
				class="btn-identify pa-10"
				@click="save"
			>저장</button>
		</div>

		<DaumPost
			:overlay="daumPostUp"
			@callBack="addPost"
		></DaumPost>
	</div>
</template>

<script>

import Title from "@/view/Layout/Title";
import DaumPost from "@/components/Daum/DaumPost";

export default{
	name: 'Modify'
	,props: ['Axios', 'member_info', 'rules', 'codes', 'user', 'TOKEN']
	,components: {DaumPost, Title }
	,data: function(){
		return {
			program: {
				name: '정보수정'
				,code: 'mypage'
				,wrap: 'mypage'
				,top: false
				,title: false
				,bottom: false
				,class: 'blue'
			}
			,daumPostUp: false
			,item: {
				TOKEN: this.TOKEN
				, member_tell: this.user.member_tell
				, member_email: this.user.member_email
				, member_post: this.user.member_post
				, member_addr1: this.user.member_addr1
				, member_addr2: this.user.member_addr2
			}
			,view: {
				password: false
			}
		}
	}
	,methods: {
		save: async function(){
			try{
				this.$emit('onLoading')
				let result = await this.Axios({
					method: 'post'
					,url: '/member/postModify'
					,data: this.item
				})
				if(result.success){
					this.$emit('setNotify', { type: 'success', message: result.message })
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch(e){
				console.log(e.message)
				this.$emit('setNotify', { type: 'error', message: e})
			}finally {
				this.$emit('offLoading')
			}
		}
		,setNotify: function({ type, message }){
			this.$emit('setNotify', { type: type, message: message })
		}
		, daumPost: function (type) {
			this.$emit('setOverlay')
			this.daumPostUp = true
			this.daumPostType = type
		}
		, addPost: function (call) {

			this.$set(this.item, 'member_post', call.zonecode)
			this.$set(this.item, 'member_addr1', call.address)

			this.daumPostUp = false
			this.$emit('setOverlay')
		}
	}
	,created: function(){
		this.$emit('onLoad', this.program)
	}
	,watch: {
	}
}
</script>

<style>
.box-mypage-list {}
.box-mypage-list.shadow { box-shadow: 0px 3px 5px rgb(0, 0, 0, .3) }
.btn-mypage-add {
	border: 1px solid #ddd;
	padding: 2px 2px 2px 7px;
	font-size: 11px
}
</style>