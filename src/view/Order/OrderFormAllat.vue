<template>
	<div>
		<iframe
			v-show="false"
			src="/payment/allat/approval.html"
		></iframe>
	</div>
</template>


<script>
export default {
	name: 'OrderFormAllat'
	, props: ['Axios', 'user', 'order_info', 'member_info', 'pg_info']
	, data: function(){
		return{
			item_allat_form: {
				// 상점아이디
				allat_shop_id: this.pg_info.pgMerchNo
				// 주문번호
				, allat_order_no: this.order_info.order_number
				// 승인금액
				, allat_amt: this.order_info.order_price
				// 회원ID
				, allat_pmember_id: this.pg_info.pgMerchName
				// 상품코드
				, allat_product_cd: this.pg_info.pgMerchName
				// 상품명
				, allat_product_nm: this.order_info.order_number
				// 결제자성명
				, allat_buyer_nm: this.member_info.member_name
				// 수취인성명
				, allat_recp_nm: this.order_info.delivery_type == 'D002002' ? this.member_info.member_name : this.order_info.d_name
				// 수취인주소
				, allat_recp_addr: this.order_info.delivery_type == 'D002002' ? '구로구 디지털로26길 5 에이스하이엔드1차7 09호' : this.order_info.d_addr1 + ' ' + this.order_info.d_addr2
				// 인증정보수신URL
				, shop_receive_url: this.$https + this.pg_info.returnUrl
				// 주문정보암호화필드
				, allat_enc_data:''

				// 이하 아래 옵션

				// 신용카드 결제 사용여부
				, allat_card_yn: ''
				// 계좌이체 결제 사용여부
				, allat_abank_yn: ''
				// 가상계좌 결제 사용여부
				, allat_vbank_yn: ''
				// 휴대폰 결제 사용여부
				, allat_hp_yn: ''
				// 상품권 결제 사용여부
				, allat_ticket_yn: ''
				// 과세여부
				, allat_tax_yn: ''
				// 할부 사용여부
				, allat_sell_yn: ''
				// 일반/무이자할부 사용여부
				, allat_zerofee_yn: ''
				// 포인트 사용여부
				, allat_bonus_yn: ''
				// 현금영수증 발급여부
				, allat_cash_yn: ''
				// 결제정보 수신 E-Mail
				, allat_email_addr: ''
				// 테스트 여부
				, allat_test_yn: ''
				// 상품 실물 여부
				, allat_real_yn: ''
				// 신용카드 에스크로 적용여부
				, allat_cardes_yn: ''
				// 게좌이체 에스크로 적용여부
				, allat_abankes_yn: ''
				// 가상계좌 에스크로 적용여부
				, allat_vbankes_yn: ''
				// 휴대폰 에스크로 적용여부
				, allat_hpes_yn: ''
				// 상품권 에스크로 적용여부
				, allat_ticketes_yn: ''
				// 성별
				, allat_gender: ''
				// 생년월일
				, allat_birth_ymd: ''
				// 제공기간
				, allat_provide_date: ''
				// 선택결제수단
				, allat_select_pay_type: ''
				// 간편결제수단
				, allat_spay_type: ''
				// 부가세
				, allat_vat_amt: ''
			}
		}
	}
	, methods: {
		getFormData: function(){
			const formData = new FormData();
			for(let [key, val] in this.item_allat_form){
				formData.append(key, val)
			}

			return formData
		}
		, onLoad: async function(){
			try{
				let result = await this.Axios({
					method: 'post'
					, url: 'https://tx.allatpay.com/servlet/AllatPayUtf8/mobile/mobile_fix_main.jsp'
					, data: this.item_allat_form
				})

				if(result.success){
					alert('success')
				}else{
					throw result.message
				}
			}catch (e) {
				console.log(e)
			}
		}

		// 문자열의 앞뒤 공백문자 제거
		, f_trim: function( value ) {
			value = value.replace(/^\s*/,'').replace(/\s*$/, '');
			return value;
		}
		, dd: function(){

		}
		, setOrder: function(){
			sessionStorage.setItem('order_info', JSON.stringify(this.item_allat_form))
			this.getOrder()
		}
		, getOrder: function(){
			let t = sessionStorage.getItem('order_info')
			if(!t){
				this.$emit('cancel')
			}else{
				t = JSON.parse(t)
				if(t.allat_order_no == this.order_info.order_number){
					// let w_a = window.open('/payment/allat/approval.html?on=' + this.order_info.order_number, 'allalt', 'width=320')

					let self = this
					window.addEventListener('message', function (e) {
						console.log('on message', e.data)

						try{

							let data = JSON.parse(e.data)
							let result = data.result
							if(result){
								console.log('success');
								self.$emit('success', data)
							}else{
								console.log('fail');
								self.$emit('fail', data)
							}
							// w_a.close()
						}catch (e){
							console.log('addEventListener', e)
						}

					});
				}else{
					this.$emit('cancel')
				}
			}

		}
	}
	, created() {
		console.log('order_info', this.order_info)
		this.setOrder()
	}
}

</script>
