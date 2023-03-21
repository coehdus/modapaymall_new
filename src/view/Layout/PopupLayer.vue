<template>
	<div
		class="position-fixed-full radius-20 z-index-layer"
	>
		<div class="bg-layer z-index-bg"></div>
		<div
			class="position-relative pa-20 flex-column justify-center full-width full-height z-index-contents"
		>
			<div>
				<slot name="body"></slot>
			</div>
		</div>

	</div>
</template>

<script>
export default {
	name: 'PopupLayer'
}
</script>

<style>
	.position-fixed-full {
		position: fixed; left: 0; top: 0; width: 100%; height: 100%;
	}
	.z-index-layer {
		z-index: 9999;
	}
	.z-index-contents {
		z-index: 9998;
	}
	.z-index-bg {
		z-index: 9997;
	}

	.bg-layer {
		position: absolute; left: 0; top: 0; width: 100%; height: 100%; opacity: 0.5; background-color: black;
	}
</style>