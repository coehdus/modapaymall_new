<template>
	<div
		class="flex-column full-height full-height"
	>
		<div class="pa-10 flex-column full-height overflow-y-auto">
			<div
			>
				<h6>제목</h6>
				<input
					v-model="item.b_title"
					placeholder="제목을 입력하세요"
					maxlength="50"
					class="input-underline"
				/>
			</div>

			<div
				class="mt-10"
			>
				<h6>{{ label_contents }}</h6>
				<textarea
					v-model="item.b_contents"
					rows="10"
				></textarea>
			</div>

			<div
				class="mt-10"
			>
				<h6>첨부파일</h6>

				<label class="mt-10 input-box full-width">
					<v-icon
						class="color-icon"
					>mdi mdi-image</v-icon>
					{{ file_name }}
					<input
						v-show="false"
						type="file"
						placeholder="대표 이미지"
						class="input-box"
						maxlength="250"
						@change="setFile"
						accept="image/*"
					/>
				</label>
			</div>
		</div>
		<div
			class="bottom"
		>
			<button
				class="btn btn-identify"
				@click="save"
			>{{ label_btn_save }}</button>
		</div>
	</div>
</template>

<script>

export default{
	name: 'BbsItem',
	components: { },
	props: ['Axios', 'member_info', 'rules', 'type', 'TOKEN']
	,data: function(){
		return {
			program: {
				name: ''
				,top: false
				,title: true
				,bottom: false
			}
			,item: {
				TOKEN: this.TOKEN
				,b_code: this.$route.params.b_code
				,b_title: ''
				,b_contents: ''
				,b_file: null
				,m_name: this.member_info.member_name
			}
			,board_config: {

			}
			,b_code: this.$route.params.b_code
			,b_code_qna: 'b_qna'
		}
	}
	,computed: {
		label_contents: function(){
			if(this.b_code == this.b_code_qna){
				return '문의 내용'
			}else{
				return '내용'
			}
		}
		,label_btn_save: function(){
			if(this.b_code == this.b_code_qna){
				return '문의 하기'
			}else{
				return '등록'
			}
		}
		,file_name: function(){
			let name = '첨부파일'
			if(this.item.b_file){
				name = this.item.b_file.name
			}
			return name
		}
	}
	,methods: {
		getBoardConfig: async function(){
			try{
				const result = await this.Axios({
					method: 'get'
					, url: 'board/getBoardconfig'
					, data: this.item
				})

				if(result.success){
					this.board_config = result.data
					this.program.name = this.board_config.b_name
					this.$emit('onLoad', this.program)
					this.$emit('setNotify', { type: 'success', message: result.message })
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch(E){
				console.log(E)
				this.$emit('setNotify', { type: 'error', message: E })
			}
		}
		,save: async function(){
			this.$emit('onLoading')
			try{
				const result = await this.Axios({
					method: 'post'
					, url: 'board/postBbs'
					, data: this.item
				})

				if(result.success){
					this.$emit('toBack')
					this.$emit('setNotify', { type: 'success', message: result.message })
				}else{
					this.$emit('setNotify', { type: 'error', message: result.message })
				}
			}catch(E){
				console.log(E)
				this.$emit('setNotify', { type: 'error', message: E })
			}finally {
				this.$emit('offLoading')
			}
		}
		,setFile: function(e){
			let file = e.target.files[0]
			this.$set(this.item, 'b_file', file)
		}
	}
	,created: function(){
		this.getBoardConfig()
		this.$emit('onLoad', this.program)
	}
}

</script>

<style>
	label { display: inline-block}
</style>