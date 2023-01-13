<template>
	<div
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
				src="/payment/billgate/pay.html"
				style=" width: 480px; height: 640px"
				frameborder="0"
			></iframe>
		</div>
	</div>
</template>
<script>
export default {
	name: 'OrderFormBillgate'
	, props: ['Axios', 'user', 'order_info', 'member_info', 'pg_info', 'is_mobile']
	, data: function(){
		return {
			item_order_form: {
				// 결제수단
				payMethod: '0900'
				// 상점아이디
				, SERVICE_ID: this.pg_info.pgMerchNo
				// 주문일시
				, ORDER_DATE: this.order_info.wDate
				// 주문번호
				, ORDER_ID: this.order_info.order_number
				// 고객아이디
				, USER_ID: this.order_info.member_id
				// 고객명
				, USER_NAME: this.member_info.member_name
				// 고객이메일
				, USER_EMAIL: this.order_info.member_email
				// 상품명
				, ITEM_NAME: this.order_info.order_number
				// 상품코드
				, ITEM_CODE: this.order_info.order_number.slice(-10)
				// 결제금액
				, AMOUNT: this.order_info.order_price
				// 결과수신URL
				, RETURN_URL: this.pg_info.returnUrl
				// 취소결과 전달 여부
				, CANCEL_FLAG: 'Y'
				// 예비변수
				, RESERVED1: ''
				, RESERVED2: ''
				, RESERVED3: ''
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
				if (t.ORDER_ID == this.order_info.order_number) {

					window.addEventListener('message', (e) => {
						console.log('on message', e.data)

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

					});
				} else {
					this.$emit('cancel')
				}
			}
		}
	}
	, async created() {
		console.log('order_info', this.order_info)
		this.setOrder()
	}
}
</script>