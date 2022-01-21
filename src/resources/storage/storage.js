
import { Base64 } from 'js-base64'
import router from '../../router'

/**
 * GET 라우터 푸시용 스토리지
 * GET 검색 조건을 로컬 스토리지에서 관리
 * @type {{init: (function(Object): Object), setQuery: (function(*=): boolean), getQuery: (function(): (any)), push: storage.push}}
 */
export const storage = {

    /**
     * 기존 object의 동일한 인자를 비교, 첨부하여 반환함
     * @param { object } 스토리지 저장 및 반환할 객체
     * @return { object } obj
     */
    init: function(obj){

        let query = this.getQuery()

        if(query) {
            for (const property in obj) {

                if(query[property] || query[property] === 0){
                    obj[property] = query[property]
                }
            }
        }

        return obj
    }
    /**
     * object를 인코딩 하여 로컬 스토리지에 저장
     * @param { object } 저장할 데이터 object
     * @return { boolean } 처리여부 반환
     */
    ,setQuery: function(data){
        localStorage.setItem(Base64.encode('query'), Base64.encode(JSON.stringify(data)))

        return true
    }

    /**
     * 로컬 스토리지에 저장된 object를 반환
     * @return { object } 반환할 데이터 object
     */
    ,getQuery: function(){
        let storage = localStorage.getItem(Base64.encode('query'))

        if(storage){
            return JSON.parse(Base64.decode(storage))
        }else{
            return {}
        }
    }

    /**
     * 로컬 스토리지 저장 및 라우터 이동
     * @param name 라우터 이름
     * @param params 라우터 인자
     * @param query 라우터 쿼리 인자
     * @param not_query 스토리지 저장 여부
     */
    ,push: function({ name, params, query, not_query }){

        if(!not_query) {
            localStorage.removeItem(Base64.encode('query'))
        }

        router.push({ name, params, query}).catch(function(e){
            console.log(e)
        })
    }
}