var popflag = "L";									//P:팝업창 호출 결제, L:Layer 팝업 호출 결제(Default)
var keyData = "6aMoJujE34XnL9gvUqdKGMqs9GzYaNo6";	//가맹점 배포 PASSKEY 입력

//주문번호, 주문시간 자동 생성 처리
function initValue(){
	document.fdpay.MxIssueDate.value = date_data();
	document.fdpay.MxIssueNO.value = document.fdpay.MxID.value + date_data();
}

//현재 시간 생성 처리(YYYYMMDDHHMMSS)
function date_data() {
	var time = new Date();
	var year = time.getFullYear() + "";
	var month = time.getMonth() + 1;
	var date = time.getDate();
	var hour = time.getHours();
	var min = time.getMinutes();
	var sec = time.getSeconds();
	if (month < 10) {
		month = "0" + month;
	}
	if (date < 10) {
		date = "0" + date;
	}
	if (hour < 10) {
		hour = "0" + hour;
	}
	if (min < 10) {
		min = "0" + min;
	}
	if (sec < 10) {
		sec = "0" + sec;
	}
	return year + month + date + hour + min + sec;
}

//결제 창 호출 요청 전문 생성 처리
function makePayData(){

	var mxid = document.fdpay.MxID.value;
	var mxissueno = document.fdpay.MxIssueNO.value;
	var amount = document.fdpay.Amount.value;

	//HASH DATA 생성!!
	var callhash = Sha256.hash(mxid + mxissueno + amount + keyData).toUpperCase();

	var temp = "";

	try{ temp += "MxID=" + document.fdpay.MxID.value + "|"; }catch (e) { temp += "MxID=|"; }
	try{ temp += "MxIssueNO=" + document.fdpay.MxIssueNO.value + "|"; }catch (e) { temp += "MxIssueNO=|"; }
	try{ temp += "MxIssueDate=" + document.fdpay.MxIssueDate.value + "|"; }catch (e) { temp += "MxIssueDate=|"; }
	try{ temp += "CcProdDesc=" + document.fdpay.CcProdDesc.value + "|"; }catch (e) { temp += "CcProdDesc=|"; }
	try{ temp += "Amount=" + document.fdpay.Amount.value + "|"; }catch (e) { temp += "Amount=|"; }
	try{ temp += "rtnUrl=" + document.fdpay.rtnUrl.value + "|"; }catch (e) { temp += "rtnUrl=|"; }
	try{ temp += "ItemInfo=" + document.fdpay.ItemInfo.value + "|"; }catch (e) { temp += "ItemInfo=|"; }
	try{ temp += "connectionType=" + document.fdpay.connectionType.value + "|"; }catch (e) { temp += "connectionType=|"; }
	try{ temp += "URL=" + document.fdpay.URL.value + "|"; }catch (e) { temp += "URL=|"; }
	try{ temp += "DBPATH=" + document.fdpay.DBPATH.value + "|"; }catch (e) { temp += "DBPATH=|"; }
	try{ temp += "Currency=" + document.fdpay.Currency.value + "|"; }catch (e) { temp += "Currency=|"; }
	try{ temp += "SelectPayment=" + document.fdpay.SelectPayment.value + "|"; }catch (e) { temp += "SelectPayment=|"; }
	try{ temp += "Tmode=" + document.fdpay.Tmode.value + "|"; }catch (e) { temp += "Tmode=|"; }
	try{ temp += "LangType=" + document.fdpay.LangType.value + "|"; }catch (e) { temp += "LangType=|"; }
	try{ temp += "BillType=" + document.fdpay.BillType.value + "|"; }catch (e) { temp += "BillType=|"; }
	try{ temp += "CardSelect=" + document.fdpay.CardSelect.value + "|"; }catch (e) { temp += "CardSelect=|"; }
	try{ temp += "escrowYn=" + document.fdpay.escrowYn.value + "|"; }catch (e) { temp += "escrowYn=|"; }
	try{ temp += "cashYn=" + document.fdpay.cashYn.value + "|"; }catch (e) { temp += "cashYn=|"; }
	try{ temp += "CcNameOnCard=" + document.fdpay.CcNameOnCard.value + "|"; }catch (e) { temp += "CcNameOnCard=|"; }
	try{ temp += "PhoneNO=" + document.fdpay.PhoneNO.value + "|"; }catch (e) { temp += "PhoneNO=|"; }
	try{ temp += "Email=" + document.fdpay.Email.value + "|"; }catch (e) { temp += "Email=|"; }
	try{ temp += "SupportDate=" + document.fdpay.SupportDate.value + "|"; }catch (e) { temp += "SupportDate=|"; }
	try{ temp += "EncodeType=" + document.fdpay.EncodeType.value + "|"; }catch (e) { temp += "EncodeType=|"; }

	temp += "CallHash=" + callhash + "|"; //CallHash DATA 추가!!

	document.fdpay.PAYDATA.value = temp;

	setTimeout( () => {

	}, 100)
}

//결제하기 호출 시 처리
function payProc(){

	if(document.fdpay.PAYDATA.value == ""){

		alert("전문 생성 후 결제 요청해 주세요.");

	}else{

		if(popflag == "P"){	//POPUP 호출 시
			window.open("pop.html","PAY_POP","width=560, height=602, scrollbars=1");
		}else{				//LAYER 호출 시
			FD_PAY_FRAME.location.href = "layer.php";	//FDK 결제 창 호출 페이지로 프레임 영역 변경
			layer_open('fdpayWin');						//"FD_PAY_FRAME" 프레임을 가지고 있는 DIV 영역의 ID를 입력(sample 이용 시 : id="fdpayWin")
		}
	}
}

//레이어 팝업 호출 시 처리
function layer_open(el){

	wrapWindowByMask();			//레이어 팝업 활성화 시 하단 MASKING 처리를 위한 함수

	var fdlayer = $('#' + el);	//레이어의 id를 fdlayer변수에 저장

	fdlayer.fadeIn();			//레이어 실행

	// 화면의 중앙에 레이어를 띄운다.
	fdlayer.css('margin-top', '-'+fdlayer.outerHeight()/2+'px');
	fdlayer.css('margin-left', '-'+fdlayer.outerWidth()/2+'px');

	fdlayer.find('a.closeBtn').click(function(e){

		fdlayer.fadeOut();			//'Close'버튼을 클릭하면 레이어가 사라진다.

		e.preventDefault();

		document.getElementById("mask").style.display = "none";	//레이어 팝업 비활성화 시 하단 MASKING 표시 해제

		FD_PAY_FRAME.location.href = "blank.html";				//빈 페이지로 프레임 영역 변경

	});
}

//레이어 팝업 하단 영역 마스킹 처리(레이어 팝업 호출 시 사용)
function wrapWindowByMask(){

	//화면의 높이와 너비를 구한다.
	var maskHeight = $(document).height();
	var maskWidth = $(window).width();

	//마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
	$('#mask').css({'width':maskWidth,'height':maskHeight});

	//애니메이션 효과
	$('#mask').fadeIn(1000);
	$('#mask').fadeTo("slow",0.6);
}

//결제 창 결과 return 처리
function result(rtncode, rtnmsg, fdtid){

	//레이어 팝업으로 호출한 경우만 처리
	if(popflag != "P"){

		FD_PAY_FRAME.location.href = "blank.html";					//결제창 결과 수신 시 빈 페이지로 프레임 영역 변경

		document.getElementById("fdpayWin").style.display = "none";	//결제창 결과 수신 시 프레임 영역 표시 해제

		document.getElementById("mask").style.display = "none";		//결제창 결과 수신 시 하단 MASKING 표시 해제
	}

	if(rtncode == "0000"){

		var mxid = document.fdpay.MxID.value;
		var mxissueno = document.fdpay.MxIssueNO.value;

		document.pay.MxID.value = mxid;
		document.pay.MxIssueNO.value = mxissueno;
		document.pay.FDTid.value = fdtid;

		document.pay.action = "send.php";
		document.pay.submit();
	}else{
		alert("인증실패["+rtncode+"("+rtnmsg+")]");
	}
}