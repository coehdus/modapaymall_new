<template>
	<div
		style="position: fixed; left: 0; top: 0; width: 100%; height: 100%;"
	>
		<div
			style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: black; opacity: 0.5;"
		></div>
		<div
			style="position: relative; width: 100%; height: 100%; overflow: auto"
			class="flex-column justify-center items-center"
		>
			<iframe
				src="/payment/corpay/mo/pay.html"
				style=" width: 320px; height: 100%; overflow: hidden"
				frameborder="0"
				class="bg-white"
			></iframe>

			<button
				v-if="is_mobile"
				class="btn bg-black"

				style="position: fixed; bottom: 0"
				@click="cancel"
			><span class="color-white size-em-12"> 결제 취소</span></button>
		</div>
	</div>
</template>
<script>
export default {
	name: 'OrderFormCorpayM'
	, props: ['Axios', 'user', 'order_info', 'member_info', 'pg_info', 'is_mobile']
	, data: function(){
		return {
			item_order_form: {
				// 결제수단
				payMethod: 'card'
				// 결제타입
				, transType: '0'
				// 상점아이디
				, id: this.pg_info.pgMerchNo
				// 상품명
				, goodsName: this.order_info.order_number
				// 결제요청통화
				, currency: 'KRW'
				// 주문번호
				, orderNo: this.order_info.order_number
				// 결제금액
				, amt: this.order_info.order_price
				// 고객명
				, buyerName: this.member_info.member_name
				// 구매자연락처
				, buyerTel: this.member_info.member_tell
				// 고객이메일
				, buyerEmail: this.order_info.member_email
				// 결과수신URL
				, returnUrl: this.pg_info.returnUrl
				, ediDate: this.pg_info.ediDate
				, hashStr: this.pg_info.hashStr
				, is_mobile: this.is_mobile
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
				if (t.orderNo == this.order_info.order_number) {

					window.addEventListener('message', (e) => {
						console.log('on message', e.data)

						if(e.data.name == 'orderFormCorpayM'){

							try {

								let data = JSON.parse(e.data)
								let result = data.result
								if (result) {
									console.log('success');
									this.$emit('success', data)
								} else {
									console.log('fail');
									this.$emit('fail', data)
								}
								// w_a.close()
							} catch (e) {
								console.log('addEventListener', e)
							}finally {
								sessionStorage.removeItem('order_info')
							}
						}

					});
				} else {
					this.$emit('cancel')
				}
			}
		}
		, cancel: function(){
			this.$emit('cancel')
		}
	}
	, async created() {
		console.log('corpay_m order_info', this.order_info)
		this.setOrder()
	}
}
</script>