import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const prefix = '/'

const routes = [
	
	{
		path: '/'
		,name: 'intro'
		,component: () => import('@/view/Main/Intro.vue')
	}
	,{
		path: prefix + 'Index'
		,name: 'Index'
		,component: () => import('@/view/Main/Index.vue')
	}
	,{
		path: prefix + 'Auth/Login'
		,name: 'Login'
		,component: () => import('@/view/Auth/Login.vue')
	}
	,{
		path: prefix + 'Auth/Login/Shop/:shop_id'
		,name: 'ShopLogin'
		,component: () => import('@/view/Auth/ShopLogin.vue')
	}
	,{
		path: prefix + 'Auth/Find/Id'
		,name: 'FindId'
		,component: () => import('@/view/Auth/FindId.vue')
	}
	,{
		path: prefix + 'Auth/Find/Pw'
		,name: 'FindPw'
		,component: () => import('@/view/Auth/FindPw.vue')
	}
	,{
		path: prefix + 'Auth/Join/:code?'
		,name: 'Join'
		,component: () => import('@/view/Auth/Join.vue')
	}
	,{
		path: prefix + 'Auth/Result'
		,name: 'JoinResult'
		,component: () => import('@/view/Auth/Result.vue')
	}
	,{
		path: prefix + 'Product/List/:category?'
		,name: 'ProductList'
		,component: () => import('@/view/Product/ProductList.vue')
	}
	,{
		path: prefix + 'Product/Detail/:idx'
		,name: 'ProductDetail'
		,component: () => import('@/view/Product/ProductDetail.vue')
	}
	,{
		path: prefix + 'Order/Cart'
		,name: 'Cart'
		,component: () => import('@/view/Order/Cart.vue')
	}
	,{
		path: prefix + 'Order/Buy'
		,name: 'OrderBuy'
		,component: () => import('@/view/Order/OrderForm.vue')
	}
	,{
		path: prefix + 'Order/Bill'
		,name: 'OrderBill'
		,component: () => import('@/view/Order/OrderForm.vue')
	}
	,{
		path: prefix + 'Order/Form'
		,name: 'OrderForm'
		,component: () => import('@/view/Order/OrderForm.vue')
	}
	,{
		path: prefix + 'Order/Result/:order_num_new'
		,name: 'OrderResult'
		,component: () => import('@/view/Order/OrderResult.vue')
	}
	,{
		path: prefix + 'Order/Detail/:order_num_new'
		,name: 'OrderDetail'
		,component: () => import('@/view/Order/OrderDetail.vue')
	}
	,{
		path: prefix + 'Order/List/:type/:page?'
		,name: 'OrderList'
		,component: () => import('@/view/Order/OrderList.vue')
	}
	,{
		path: prefix + 'Order/Regular'
		,name: 'OrderRegular'
		,component: () => import('@/view/Order/OrderRegularList.vue')
	}
	,{
		path: prefix + 'Order/Regular/Detail/:idx'
		,name: 'OrderRegularDetail'
		,component: () => import('@/view/Order/OrderRegularDetail.vue')
	}
	,{
		path: prefix + 'Order/Odt/Confirm/:odt_uid'
		,name: 'OdtConfirm'
		,component: () => import('@/view/Order/OdtConfirm.vue')
	}
	,{
		path: prefix + 'Order/Odt/Return/:odt_uid'
		,name: 'OdtReturn'
		,component: () => import('@/view/Order/OdtReturn.vue')
	}
	,{
		path: prefix + 'Account/MyPage'
		,name: 'MyPage'
		,component: () => import('@/view/Account/MyPage.vue')
	}
	,{
		path: prefix + 'Account/Modify'
		,name: 'Modify'
		,component: () => import('@/view/Account/Modify.vue')
	}
	,{
		path: prefix + 'Account/Password'
		,name: 'Password'
		,component: () => import('@/view/Account/Password.vue')
	}
	,{
		path: prefix + 'Account/Shipping'
		,name: 'Shipping'
		,component: () => import('@/view/Account/ShippingList.vue')
	}
	,{
		path: prefix + 'Credit'
		,name: 'CreditList'
		,component: () => import('@/view/Account/CreditList.vue')
	}
	,{
		path: prefix + 'Credit/Register'
		,name: 'CreditRegister'
		,component: () => import('@/view/Account/CreditRegister.vue')
	}
	,{
		path: prefix + 'CustomerCenter/:b_code'
		,name: 'CustomerCenter'
		,component: () => import('@/view/Customer/CustomerCenter.vue')
	}
	,{
		path: prefix + 'Bbs/Item/:b_code'
		,name: 'BbsItem'
		,component: () => import('@/view/Bbs/BbsItem.vue')
	}
	,{
		path: '*',
		name:'404', 
		component: () => import('@/view/Error/NotFound.vue')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	// console.log('from: ' + from.path + ' to : ' + to.path)
	next();
});

export default router
