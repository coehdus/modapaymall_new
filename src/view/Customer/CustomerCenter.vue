<template>
	<div class="full-height flex-column">
		<div
			class="tab justify-space-between"
		>
			<div
				@click="type = 'notice'"
				class="pa-10 flex-1 box text-center"
				:class="{ on: type == 'notice'}"
			>공지사항</div>
			<div
				@click="type = 'qna'"
				class="pa-10 flex-1 box text-center"
				:class="{ on: type == 'qna'}"
			>1:1문의</div>
			<div
				@click="type = 'review'"
				class="pa-10 flex-1 box text-center"
				:class="{ on: type == 'review'}"
			>리뷰관리</div>
		</div>
		<div
			class=""
		>
			<NoticeList
				v-if="type == 'notice'"
			></NoticeList>
			<QnAList
				v-if="type == 'qna'"
			></QnAList>
			<ReviewList
				v-if="type == 'review'"
			></ReviewList>
		</div>
	</div>
</template>

<script>

	import NoticeList from "./NoticeList";
	import QnAList from "./QnAList";
	import ReviewList from "./ReviewList";
	export default {
		name: 'CustomerCenter'
		,
		components: {ReviewList, QnAList, NoticeList},
		props: ['Axios']
		,data: function(){
			return {
				program: {
					name: '고객센터'
					,top: false
					,title: true
					,bottom: true
				}
				,type: this.$route.params.type ? this.$route.params.type : 'notice'
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