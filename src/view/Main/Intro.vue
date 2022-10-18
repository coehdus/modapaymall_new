<template>
	<v-container>	
		<v-row class="text-center">

			<v-col class="mb-4">
				<h1 class="display-2 font-weight-bold mb-3">
					프로젝트
				</h1>

				<p class="subheading font-weight-regular">
					Vue
				</p>
			</v-col>

			<v-col
				class="mb-5"
				cols="12"
			>
				<h2 class="headline font-weight-bold mb-10">
					함께하기
				</h2>

				<v-row 
					justify="center"
					class="pa-10 ma-10"
				>
					<v-col
						cols="12"
						v-for="(next, i) in whatsNext"
						:key="i"
					>
						{{ next.text }}
						<a
							:href="next.href"
							class="subheading mx-3"
							target="_blank"
						>
							{{ next.href }}
						</a>
					</v-col>
				</v-row>
			</v-col>

			<v-col
				class="mb-5"
				cols="12"
			>
				<h2 class="headline font-weight-bold mb-3">
					참고하기
				</h2>

				<v-row justify="center">
					<v-col
						cols="12"
						v-for="(link, i) in importantLinks"
						:key="i"
					>
						{{ link.text }}
						<a
							:href="link.href"
							class="subheading mx-3"
							target="_blank"
						>
							{{ link.href }}
						</a>
					</v-col>
				</v-row>
			</v-col>

			<v-col
				class="mb-5"
				cols="12"
			>
				<h2 class="headline font-weight-bold mb-3">
					살펴보기
				</h2>

				<v-row justify="center">
					<v-col 
						cols="12"
						v-for="(eco, i) in ecosystem"
						:key="i"
					>
						{{ eco.text }}
						<a
							:href="eco.href"
							class="subheading mx-3"
							target="_blank"
						>
							{{ eco.href }}
						</a>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	
	export default{
		name: 'Main'
		,props: ['Axios']
		,data: function(){
			return {
				ecosystem: [
					{
						text: 'vuetify-loader',
						href: 'https://github.com/vuetifyjs/vuetify-loader',
					},
					{
						text: 'github',
						href: 'https://github.com/vuetifyjs/vuetify',
					},
					{
						text: 'awesome-vuetify',
						href: 'https://github.com/vuetifyjs/awesome-vuetify',
					},
				],
				importantLinks: [
					{
						text: 'mid icon',
						href: 'https://pictogrammers.github.io/@mdi/font/5.4.55/',
					},
				],
				whatsNext: [
					{
						text: 'Axios',
						href: 'https://github.com/axios/axios',
					},
					{
						text: 'Router',
						href: 'https://router.vuejs.org/kr/installation.html',
					},
					{
						text: 'Vuetify',
						href: 'https://vuetifyjs.com/en/getting-started/installation/',
					},
					{
						text: 'DaumPost',
						href: 'https://www.npmjs.com/package/vue-daum-postcode',
					},
				],
			}	
		}
		
		,created: function(){
			this.$router.push({ name: 'Index'})
			//this.$bus.$emit('notify', { type: 'success', message: 'base template'})
		}
	}
	
</script>