<template>
	<div>

	</div>
</template>

<script>
	export default {
		name: 'OrderFormAllat'
		, props: ['user', 'order_info', 'member_info', 'pg_info']
		, data: function(){
			return{
				item_allat_form: {
					// 상점아이디
					allat_shop_id: this.pg_info.pgMerchNo
					// 주문번호
					, allat_order_no: this.order_info.order_number_new
					// 승인금액
					, allat_amt: this.order_info.order_price
					// 회원ID
					, allat_pmember_id: this.member_info.member_id
					// 상품코드
					, allat_product_cd: this.order_info.order_number_new
					// 상품명
					, allat_product_nm: this.order_info.order_number_new
					// 결제자성명
					, allat_buyer_nm: this.member_info.member_name
					// 수취인성명
					, allat_recp_nm: this.order_info.d_name
					// 수취인주소
					, allat_recp_addr: this.order_info.d_addr1 + ' ' + this.order_info.d_addr2
					// 인증정보수신URL
					, shop_receive_url: ''
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

		}
		, created() {

		}
	}
</script>