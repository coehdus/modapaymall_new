

export const codes = {
	metaInfo: {
		title: 'delimall'
		,copyright: 'Delimall'
	}
	,img_url: 'http://delimall.co.kr/API/data/product/'
	,banner_url: 'http://delimall.co.kr/API/data/banner/'
	,pay_div: {
		card: { code: 'card', name: '카드결제', color: 'blue'}
		,bank: { code: 'bank', name: '무통장 입금', color: 'gray'}
		,point: { code: 'point', name: '포인트 결제', color: 'red'}
	}
	,o_status: [
		{ code: 0, name: '', color: ''}
		,{ code: 1, name: '결제대기', color: 'gray'}
		,{ code: 2, name: '결제완료', color: 'green'}
		,{ code: 3, name: '결제취소요청', color: 'orange'}
		,{ code: 4, name: '결제취소', color: 'red'}
	]
	,odt_status: {

		step1: { code: 1, name: '주문접수', color: ''}
		,step2: { code: 2, name: '배송준비중', color: ''}
		,step3: { code: 3, name: '배송중', color: ''}
		,step4: { code: 4, name: '배송완료', color: ''}
		,step5: { code: 5, name: '구매확정', color: 'green'}
		,step21: { code: 21, name: '주문 취소 요청', color: 'red'}
		,step22: { code: 22, name: '주문 취소 완료', color: 'red'}
		,step31: { code: 31, name: '교환요청', color: 'orange'}
		,step32: { code: 32, name: '교환처리중', color: 'orange'}
		,step33: { code: 33, name: '교환 배송중', color: 'orange'}
		,step34: { code: 34, name: '교환 완료', color: 'orange'}
		,step41: { code: 41, name: '반품 요청', color: 'red'}
		,step42: { code: 42, name: '반품 처리중', color: 'red'}
		,step43: { code: 43, name: '반품 완료', color: 'red'}
	}
	,is_sold: [
		"무한", "품절", "재고"
	]
	,parcel: [
		{ name: 'CJ대한통운', val: 'https://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no='}
		, { name: '우체국택배', val: 'https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?sid1='}
		, { name: '한진택배', val: 'http://www.hanjin.co.kr/Delivery_html/inquiry/result_waybill.jsp?wbl_num='}
		, { name: '롯데택배', val: 'http://www.hlc.co.kr/hydex/jsp/tracking/trackingViewCus.jsp?InvNo='}
		, { name: '로젠택배', val: 'http://d2d.ilogen.com/d2d/delivery/invoice_tracesearch_quick.jsp?slipno='}
		, { name: '드림택배', val: 'http://www.kglogis.co.kr/delivery/delivery_result.jsp?item_no='}
		, { name: 'CVsnet 편의점택배', val: 'http://www.cvsnet.co.kr/postbox/m_delivery/local/local.jsp?invoice_no='}
		, { name: 'KGB택배', val: 'http://www.kgbls.co.kr//sub5/trace.asp?f_slipno='}
		, { name: '경동택배', val: 'http://kdexp.com/sub3_shipping.asp?stype=1&yy=&mm=&p_item='}
		, { name: '대신택배', val: 'http://home.daesinlogistics.co.kr/daesin/jsp/d_freight_chase/d_general_process2.jsp?billno1='}
		, { name: '일양로지스', val: 'http://www.ilyanglogis.com/functionality/tracking_result.asp?hawb_no='}
		, { name: '합동택배', val: 'http://www.hdexp.co.kr/parcel/order_result_t.asp?stype=1&p_item='}
		, { name: 'GTX로지스', val: 'http://www.gtxlogis.co.kr/tracking/default.asp?awblno='}
		, { name: '건영택배', val: 'http://www.kunyoung.com/goods/goods_01.php?mulno='}
		, { name: '천일택배', val: 'http://www.chunil.co.kr/HTrace/HTrace.jsp?transNo='}
	]
}
