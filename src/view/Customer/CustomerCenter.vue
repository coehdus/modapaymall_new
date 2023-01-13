<template>
	<div class="full-height flex-column">
		<div
			class="tab justify-space-between"
		>
			<div
				@click="toBbs(b_code_notice)"
				class="pa-10 flex-1 box text-center"
				:class="{ on: b_code == b_code_notice}"
			>공지사항</div>
			<div
				@click="toBbs(b_code_qna)"
				class="pa-10 flex-1 box text-center"
				:class="{ on: b_code == b_code_qna}"
			>1:1문의</div>
			<div
				@click="toBbs(b_code_after)"
				class="pa-10 flex-1 box text-center"
				:class="{ on: b_code == b_code_after}"
			>리뷰관리</div>
		</div>
		<div
			class="full-height"
		>
			<NoticeList
				v-if="b_code == b_code_notice"
				:Axios="Axios"
				:TOKEN="TOKEN"
				:Viewer="Viewer"
				:member_info="member_info"

				@onLoading="$emit('onLoading')"
				@offLoading="$emit('offLoading')"
				@setNotify="setNotify"
			></NoticeList>
			<QnAList
				v-if="b_code == b_code_qna"

				:Axios="Axios"
				:TOKEN="TOKEN"
				:member_info="member_info"
				@onLoading="$emit('onLoading')"
				@offLoading="$emit('offLoading')"
				@setNotify="setNotify"
				@push="push"
			></QnAList>
			<ReviewList
				v-if="b_code == b_code_after"

				:Axios="Axios"
				:TOKEN="TOKEN"
				:member_info="member_info"
				@onLoading="$emit('onLoading')"
				@offLoading="$emit('offLoading')"
				@setNotify="setNotify"
			></ReviewList>
		</div>
	</div>
</template>

<script>

	import NoticeList from "./NoticeList";
	import QnAList from "./QnAList";
	import ReviewList from "./ReviewList";
	import '@toast-ui/editor/dist/toastui-editor-viewer.css';

	export default {
		name: 'CustomerCenter'
		,components: {ReviewList, QnAList, NoticeList}
		,props: ['Axios', 'codes', 'TOKEN', 'member_info']
		,data: function(){
			return {
				program: {
					name: '고객센터'
					, top: false
					, title: true
					, bottom: true
				}
				, b_code: this.$route.params.b_code ? this.$route.params.b_code : this.b_code_notice
				, Viewer: null
				, b_code_notice: 'b_notice'
				, b_code_qna: 'b_qna'
				, b_code_after: 'b_after'
			}
		}
		,methods: {
			setNotify: function({ type, message }){
				this.$bus.$emit('notify', { type: type, message: message })
			}
			,toBbs: function(b_code){
				this.$emit('push', {name: 'CustomerCenter', params: { b_code: b_code }})
			}
			,push: function( name, params){
				this.$emit('push', name, { params: params })
			}
		}
		,created() {
			this.$emit('onLoad', this.program)
		}
	}

</script>

<style>
	.tab .on { background-color: #333; color: #eee}
</style>