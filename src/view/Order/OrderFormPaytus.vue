<template>
	<div
		v-if="is_ready"
		style="position: fixed; left: 0; top: 0; width: 100%; height: 100%;"
	>
		<div
			style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: black; opacity: 0.5;"
		></div>
		<div
			style="position: relative; width: 100%; height: 100%;"
			class="flex-column justify-center items-center"
		>
			<iframe
				src="/payment/paytus/pay.html"
				style=" width: 100%; height: 800px;"
				frameborder="0"
			></iframe>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'OrderFormPaytus'
		, props: ['Axios', 'user', 'order_info', 'member_info', 'pg_info']
		, data: function(){
			return {
				item_order_form: {
					// 결제수단
					payMethod: 'card'
					// 상점아이디
					, mid: this.pg_info.pgMerchNo
					// 상품명
					, goodsNm: this.order_info.order_number
					// 주문번호
					, ordNo: this.order_info.order_number
					// 결제금액
					, goodsAmt: this.order_info.order_price
					// 구매자명
					, ordNm: this.member_info.member_name
					// 구매자연락처
					, ordTel: this.order_info.member_tell
					// 주문자이메일주소
					, ordEmail: ''
					// 결과수신URL
					, returnUrl: this.pg_info.returnUrl
					// notiUrl
					, notiUrl: ''

					// 이하 옵션
					, userIp: ''
					, trxCd: '0'
					, mbsUsrId: ''
					, charSet: 'UTF-8'
					, appMode: '1'
					, ediDate: this.order_info.ediDate
					, encData: this.order_info.encData
				}
				, is_ready: false
			}
		}
		, methods: {

			setOrder: function(){
				sessionStorage.setItem('order_info', JSON.stringify(this.item_order_form))
				this.getOrder()
			}
			, getOrder: function() {
				let t = sessionStorage.getItem('order_info')
				if (!t) {
					this.$emit('cancel')
				} else {
					t = JSON.parse(t)
					if (t.ordNo == this.order_info.order_number) {

						window.addEventListener('message', (e) => {
							// console.log('on message', e.data)

							try {

								let data = JSON.parse(e.data)
								let result = data.result
								if (result) {
									// console.log('success');
									this.$emit('success', data)
								} else {
									// console.log('fail');
									this.$emit('fail', data)
								}
								// w_a.close()
							} catch (e) {
								// console.log('addEventListener', e)
							}finally {
								sessionStorage.removeItem('order_info')
							}

						});
					} else {
						this.$emit('cancel')
					}
				}
			}
			, getEncData: async function(){
				this.$bus.$emit('on', true)
				try{
					const result = await this.Axios({
						method: 'get'
						,url: 'paytus/getEncData'
						,data: {
							order_number: this.order_info.order_number
							, pg_uid: this.pg_info.uid
						}
					})

					if(result.success){
						this.item_order_form.ediDate = result.data.ediDate
						this.item_order_form.encData = result.data.encData
						this.is_ready = true
						this.setOrder()
					}else{
						throw result.message
						//await this.toCancel(this.order_number_new)
					}
				}catch (e) {
					// await this.toCancel(this.order_number_new)
					this.$bus.$emit('notify', { type: 'error', message: e})
					this.$emit('fail')
				}finally {
					this.$bus.$emit('on', false)
				}
			}
		}
		, async created() {
			// console.log('order_info', this.order_info)
			await this.getEncData()

		}
	}
</script>