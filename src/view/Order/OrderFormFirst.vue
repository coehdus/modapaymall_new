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
				src="/payment/first/start.html"
				style=" width: 650px; height: 800px;"
				frameborder="0"
			></iframe>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'OrderFormFirst'
		, props: ['user', 'order_info', 'member_info', 'pg_info']
		, data: function(){
			return {
				item_order_form: {
					// 상점아이디
					MxID: this.pg_info.pgMerchNo
					// 주문번호
					, MxIssueNO: this.order_info.order_number
					// 주문시간
					, MxIssueDate: this.order_info.order_number.substring(0, 14)
					// 상품명
					, CcProdDesc: this.order_info.order_number
					// 결제금액
					, Amount: this.order_info.order_price
					// 결과수신URL
					, rtnUrl: this.pg_info.returnUrl
					// 상품종류
					, ItemInfo: 1
					// 입금통보TYPE
					, connectionType: 'https'
					// 입금통보URL
					, URL: ''
					// 입금통보상세경로
					, DBPATH: ''
					// 결제종류
					, SelectPayment: 'CRDT'
					// 카드사선택 - 전체-00(Default), 비씨사용시-01, 비씨,신한사용시-01:02
					, CardSelect: '00'

					// 이하 아래 옵션

					// 에스크로사용여부 - Y:에스크로만, S:에스크로/일반선택(Default), N:일반만
					, escrowYn: ''
					// 현금영수증사용여부 - Y:사용(Default), N:미사용
					, cashYn: ''
					// 사용언어구분 - HAN:한글, ENG:영어
					, LangType: 'HAN'
					// 인코딩구분 - U:utf-8, E:euc-kr
					, EncodeType: 'U'
					// 주문자명
					, CcNameOnCard: this.member_info.member_name
					// 주문자이메일주소
					, Email: ''
					// 주문자연락처
					, PhoneNO: ''
					// 화폐코드 - KRW:한화, USD:달러화
					, Currency: ''
					// 거래방식 - WEB:PC결제, MOB:모바일(스마트폰)결제
					, Tmode: ''
					// 영수증과세구분 - 00:과세, 01:면세
					, BillType: ''
					// 결제창제공기간표기 - 없을경우 미 표기 (사용 예) 2015.04.02 ~ 2016.05.03)
					, SupportDate: ''
					// 가맹점 배포 PASSKEY
					, keyData: this.pg_info.pgKey
				}
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
					if (t.MxIssueNO == this.order_info.order_number) {

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
		}
		, created() {
			// console.log('order_info', this.order_info)
			this.setOrder()
		}
	}
</script>