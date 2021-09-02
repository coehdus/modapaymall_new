

export const codes = {
	metaInfo: {
		title: 'reappaypg_agency'
		,copyright: 'REAPPAY Payment'
	}
	,posStatus: [
		{ code: '', codeName: '단말기 상태를 선택하세요' }
		,{ code: 'Normal', codeName: '정상사용' }
		,{ code: 'Pause', codeName: '사용중지' }
		,{ code: 'Termination', codeName: '해지' }
	]
	,posType: [
		{ code: '', codeName: '단말기 타입을 선택하세요' }
		,{ code: 'Fixed', codeName: '유선 단말기' }
		,{ code: 'Wireless', codeName: '무선 단말기' }
	]
	,settlementStatus: [
		{ code: '', codeName: '전체'}
		,{ code: 'Pause', codeName: '정산대기'}
		,{ code: 'Normal', codeName: '정산완료'}
		,{ code: '003', codeName: '지급보류'}
	]
	,merchants: {
		status: [
			{ code: '', codeName: '전체'}
			,{ code: 'Normal', codeName: '정상사용'}
			,{ code: 'Pause', codeName: '사용중지'}
			,{ code: 'Termination', codeName: '해지'}
		]
	}
	,serviceType: [
		{ code: '001', codeName: '인증(온라인)'}
		,{ code: '002', codeName: '비인증(수기)'}
		,{ code: '003', codeName: 'OFF PG(단말기)'}
	]
	,companyType: [
		{ code: 'PUBLIC', name: '법인 사업자'}
		,{ code: 'PRIVATE', name: '개인 사업자'}
		,{ code: 'NON', name: '비사업자'}
	]
	,merchantType: [
		{ code: '001', name: '직영'}
		,{ code: 'Resales', name: '리셀러'}
		,{ code: 'Dealer', name: '딜러'}
	]
	,insurancesNon: {
		insuranceCoverageAmount: ''
		,oneTimeLimit: 2000000
		,monthLimit: 4000000
		,yearLimit: 38000000
	}
}
