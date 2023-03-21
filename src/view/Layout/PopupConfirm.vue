<template>
	<PopupLayer>
		<template
			v-slot:body
		>
			<div class="pa-40 bg-white radius-top-20">
				<div class="bg-popup-title pa-10-20 flex-row justify-space-between items-center">
					<h4><slot name="title"></slot></h4>
					<v-icon
						@click="$emit('cancel')"
					>mdi-close-circle</v-icon>
				</div>

				<hr class="under-line ">

				<div class="pa-50-20 height-min-480">

					<div class="font-popup-main"><slot name="main-txt"></slot></div>

					<div class="font-popup-sub"><slot name="sub-txt"></slot></div>

					<slot name="content"></slot>
				</div>
			</div>

			<div
				class="bg-none top-line flex-row justify-space-between radius-bottom-20"
			>
				<button
					v-if="!not_cancel"
					@click="$emit('cancel')"
					class="btn btn-dark-gray"
				><slot name="name-cancel">취소</slot></button>
				<button
					@click="$emit('click')"
					class="btn btn-primary"
				><slot name="name-confirm">확인</slot></button>
			</div>
		</template>
	</PopupLayer>
</template>

<script>
import PopupLayer from "@/view/Layout/PopupLayer";
export default {
	name: 'PopupConfirm'
	,
	components: {PopupLayer},
	props: ['type', 'not_cancel']
	, data: function(){
		return {

		}
	}
}
</script>

<style>
	.bg-popup-title { background-color: var(--bg-white); color: #333}
	.font-popup-main { font-size: 16px; font-weight: 700}
	.font-popup-sub { font-size: 14px; font-weight: 500}


</style>
