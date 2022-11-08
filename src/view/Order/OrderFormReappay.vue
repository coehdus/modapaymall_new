<template>

	<form
		v-show="false"
		id="ReapPayAuth" name="ReapPayAuth" method="post"
	>
		테스트여부
		<input 	v-model="is_test" name="testPay"/>
		<br/>
		가맹점 ID
		<input 	v-model="pg_info.pgMerchNo" name="pgMerchNo" />

		<br/>
		가맹점명
		<input 	v-model="pg_info.pgMerchName" name="pgMerchName"/>

		<br/>
		가맹점 홈페이지
		<input 	v-model="storeUrl" name="storeUrl"/>

		<br/>
		가맹점 사업자 번호
		<input 	v-model="shop_info.site_biz_number" name="storeBizNo"/>

		<br/>

		주문번호
		<input 	v-model="order_item.order_number" name="orderSeq"/>

		<br/>
		상품구분
		<input 	name="productType" value="R"/>

		<br/>
		상품명
		<input 	v-model="order_item.pdt_name" name="goodsName"/>

		<br/>

		상품코드
		<input 	v-model="order_item.pdt_code" name="goodsCode"/>

		<br/>
		금액
		<input 	v-model="order_item.order_price" name="totAmt"/>

		<br/>
		부가세
		<input 	v-model="vatAmt" name="vatAmt"/>

		<br/>
		서비스금액
		<input 	v-model="order_item.svcAmt" name="svcAmt"/>


		<br/>

		주문자명
		<input 	v-model="order_item.member_name" name="custName"/>

		<br/>
		통화구분
		<input 	name="currencyType" value="WON"/>

		<br/>

		결제방법
		<input 	name="payMethod" value="CARD"/>

		<br/>
		디비
		<input 	v-model="returnUrl" name="returnUrl"/>

		<br/>
		성공
		<input 	v-model="successUrl" name="successUrl"/>

		<br/>
		실패
		<input 	v-model="failureUrl" name="failureUrl"/>

	</form>
</template>

<script>
export default {
	name: 'OrderFormReappay'
	,props: ['Axios', 'item', 'user', 'order_item', 'referrer_code', 'pg_info', 'shop_info']
	,data: function(){
		return{

		}
	}
	, computed: {
		storeUrl: function(){
			return process.env.VUE_APP_DOMAIN
		}
		,is_test: function(){
			let test = 'Y'

			let domain = process.env.VUE_APP_DOMAIN
			let location = window.location.href
			if(location.indexOf(domain) > -1){
				test = 'N'
			}

			return test
		}
		,vatAmt: function(){
			let vat = 0
			if(this.order_item.order_price > 0){
				vat = Number(this.order_item.order_price * 10 / 100).toFixed(0)
			}
			return vat
		}
		,returnUrl: function(){
			let url = ''

			let domain = process.env.VUE_APP_DOMAIN
			let location = window.location.href

			if(location.indexOf(domain) > -1){
				url = process.env.VUE_APP_SERVER + '/' + this.pg_info.returnUrl
			}else{
				url = process.env.VUE_APP_DEV + '/' + this.pg_info.returnUrl
			}

			return url
		}
		,successUrl: function(){
			let url = ''

			let domain = process.env.VUE_APP_DOMAIN
			let location = window.location.href
			console.log(window.location)
			if(location.indexOf(domain) > -1){
				url = window.location.origin + '/' + this.pg_info.successUrl
			}else{
				url = window.location.origin + '/' + this.pg_info.successUrl
			}

			return url
		}
		,failureUrl: function(){
			let url = ''

			let domain = process.env.VUE_APP_DOMAIN
			let location = window.location.href

			if(location.indexOf(domain) > -1){
				url = window.location.origin + '/' + this.pg_info.failureUrl
			}else{
				url = window.location.origin + '/' + this.pg_info.failureUrl
			}

			return url
		}
	}
	,methods:{

		openPop: function(){

			let pop_title = "popupOpener";
			let option = "width = 500, height = 500, top = 100, left = 200, location = no"

			window.open("", pop_title, option);

			let frmData = document.ReapPayAuth;
			frmData.target = pop_title;

			const domain = process.env.VUE_APP_DOMAIN
			const location = window.location.href

			// 20211029 도신욱 추가
			if(location.indexOf(domain) > -1){
				frmData.action = this.pg_info.pgApiUrl;		// 라이브 서버
			}else{
				frmData.action = this.pg_info.pgApiUrlDev;	// 개발 서버
			}
			frmData.submit();

			let self = this
			window.addEventListener('message', function (e) {

				let data = JSON.parse(e.data)
				console.log('addEventListener2', data)
				let result = data.result
				if(result){
					console.log('success');
					self.$emit('success', data)
				}else{
					console.log('fail');
					self.$emit('fail', data)
				}
			});
		}
	}
	,created() {
		console.log('created')
		setTimeout(() => this.openPop(), 1000);
	}
}
</script>