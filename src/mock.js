// const Mock = require('mockjs')
//
// const Random = Mock.Random
//
// let Result = {
//     code: 200,
//     msg: 'ok',
//     data: null
// }
//
// Mock.mock('/login', 'post', () => {
//     Result.code = 400
//     Result.msg = 'wrong'
//     return Result
// })
//
// Mock.mock('/sys/menu/nav', 'get', () => {
//     let nav = [
//         {
//             title: '信息管理',
//             name: 'InfoManage',
//             icon: 'el-icon-s-operation',
//             component: '',
//             path: '',
//             children: [
//                 {
//                     title: '商品信息',
//                     name: 'Goods',
//                     icon: 'el-icon-shopping-cart-1',
//                     component: 'sys/GoodsInformation',
//                     path: '/sys/goodsInformation',
//                     children: []
//                 },
//                 {
//                     title: '供应商信息',
//                     name: 'Supplier',
//                     icon: 'el-icon-s-custom',
//                     component: 'sys/Supplier',
//                     path: '/sys/supplier',
//                     children: []
//                 },
//                 {
//                     title: '商品品牌',
//                     name: 'Brand',
//                     icon: 'el-icon-postcard',
//                     component: 'sys/Brand',
//                     path: '/sys/brand',
//                     children: []
//                 },
//                 {
//                     title: '商品分类',
//                     name: 'GoodsType',
//                     icon: 'el-icon-menu',
//                     component: 'sys/GoodsType',
//                     path: '/sys/goodsType',
//                     children: []
//                 },
//                 {
//                     title: '商品规格',
//                     name: 'GoodsSpecification',
//                     icon: 'el-icon-notebook-2',
//                     component: 'sys/GoodsSpecification',
//                     path: '/sys/goodsSpecification',
//                     children: []
//                 },
//                 {
//                     title: '供应记录',
//                     name: 'Supply',
//                     icon: 'el-icon-coin',
//                     component: 'sys/Supply',
//                     path: '/sys/supply',
//                     children: []
//                 }
//             ]
//         }
//     ]
//     let authorities = []
//
//     Result.data = {
//         nav: nav,
//         authorities: authorities
//     }
//     return Result
// })
//
// Mock.mock(RegExp('/sys/brand/list*'), 'get', () => {
//     let brands = [
//         {
//             'brdId': 1,
//             'brdName': '英特尔',
//             'brdWebsite': 'https://www.intel.cn/content/www/cn/zh/homepage.html'
//         },
//         {
//             'brdId': 2,
//             'brdName': 'AMD',
//             'brdWebsite': 'https://www.amd.com/zh-hans'
//         },
//         {
//             'brdId': 3,
//             'brdName': '华硕',
//             'brdWebsite': 'https://www.asus.com.cn'
//         },
//         {
//             'brdId': 4,
//             'brdName': '百度',
//             'brdWebsite': 'https://www.baidu.com'
//         }
//     ]
//     Result.data = {
//         'records': brands,
//         "total": 4,
//         "size": 10,
//         "current": 1,
//         "orders": [],
//         "optimizeCountSql": true,
//         "hitCount": false,
//         "countId": null,
//         "maxLimit": null,
//         "searchCount": true,
//         "pages": 1
//     }
//     return Result
// })
//
// Mock.mock(RegExp('/sys/brand/*'), 'post', () => {
//     Result.data = null
//     return Result
// })
//
// Mock.mock(RegExp('/sys/brand/info/*'), 'get', () => {
//     Result.data = {
//         brdId: '1',
//         brdName: '英特尔',
//         brdWebsite: 'https://www.intel.cn/content/www/cn/zh/homepage.html'
//     }
//     return Result
// })
//
// Mock.mock('/sys/goodsType/id', 'get', () => {
//     Result.data = [
//         {
//             tyId: '1',
//             tyName: '英特尔'
//         },
//         {
//             tyId: '2',
//             tyName: 'AMD'
//         },
//         {
//             tyId: '3',
//             tyName: '华硕'
//         },
//         {
//             tyId: '4',
//             tyName: '百度'
//         },
//     ]
//     return Result
// })
//
// Mock.mock(RegExp('/sys/goodsType/info/*'), 'get', () => {
//     Result.data = {
//         'tyId': '1',
//         'tyName': '英特尔',
//         'tySuper': ''
//     }
//     return Result
// })
//
// Mock.mock(RegExp('/sys/goodsType/*'), 'post', () => {
//     Result.data = null
//     return Result
// })
//
// Mock.mock(RegExp('/sys/goodsType/list*'), 'get', () => {
//     let types = [
//         {
//             'tyId': 1,
//             'tyName': '英特尔',
//             'tySuper': 'https://www.intel.cn/content/www/cn/zh/homepage.html'
//         },
//         {
//             'tyId': 2,
//             'tyName': 'AMD',
//             'tySuper': 'https://www.amd.com/zh-hans'
//         },
//         {
//             'tyId': 3,
//             'tyName': '华硕',
//             'tySuper': 'https://www.asus.com.cn'
//         },
//         {
//             'tyId': 4,
//             'tyName': '百度',
//             'tySuper': 'https://www.baidu.com'
//         }
//     ]
//     Result.data = {
//         'records': types,
//         "total": 2,
//         "size": 10,
//         "current": 1,
//         "orders": [],
//         "optimizeCountSql": true,
//         "hitCount": false,
//         "countId": null,
//         "maxLimit": null,
//         "searchCount": true,
//         "pages": 1
//     }
//     return Result
// })
//
// Mock.mock(RegExp('/sys/goodsInfo/intro/*'), 'get', () => {
//     Result.data = '普洱茶云南省的西双版纳、临沧、普洱等地区，大乔木，高达16米，嫩枝有微毛，顶芽有白柔毛。叶薄革质，椭圆形。花腋生，被柔毛。苞片2，早落。萼片5，近圆形，外面无毛。花瓣6-7片，倒卵形，无毛。雄蕊长8-10毫米，离生，无毛。子房3室，被茸毛；花柱长8毫米，先端3裂。蒴果扁三角球形。种子每室1个，近圆形，直径1厘米。 [1] \n' +
// '普洱茶讲究冲泡技巧和品饮艺术，可清饮，可混饮。普洱茶茶汤橙黄浓厚，香气高锐持久，香型独特，滋味浓醇，经久耐泡。'
//     return Result
// })
//
// Mock.mock(RegExp('/sys/goodsInfo/list*'), 'get', () => {
//     let goodsInformation = [
//         {
//             'gdId': 1,
//             'gdName': 'Intel Core i7',
//             'brdId': 1,
//             'tyId': 1,
//             'speciId': 1,
//             'gdMarketPrice': '3000',
//             'gdCostPrice': '20',
//             'gdIntro': '普洱茶云南省的西双版纳、临沧、普洱等地区，大乔木，高达16米，嫩枝有微毛，顶芽有白柔毛。叶薄革质，椭圆形。花腋生，被柔毛。苞片2，早落。萼片5，近圆形，外面无毛。花瓣6-7片，倒卵形，无毛。雄蕊长8-10毫米，离生，无毛。子房3室，被茸毛；花柱长8毫米，先端3裂。蒴果扁三角球形。种子每室1个，近圆形，直径1厘米。 [1] \n' +
//                 '普洱茶讲究冲泡技巧和品饮艺术，可清饮，可混饮。普洱茶茶汤橙黄浓厚，香气高锐持久，香型独特，滋味浓醇，经久耐泡。',
//             'gdAmount': 9999
//         }
//     ]
//     Result.data = {
//         'records': goodsInformation,
//         "total": 1,
//         "size": 10,
//         "current": 1,
//         "orders": [],
//         "optimizeCountSql": true,
//         "hitCount": false,
//         "countId": null,
//         "maxLimit": null,
//         "searchCount": true,
//         "pages": 1
//     }
//     return Result
// })
//
// Mock.mock(RegExp('/sys/goodsInfo/info/*'), 'get', () => {
//     Result.data = {
//         'gdId': 1,
//         'gdName': 'Intel Core i7',
//         'brdId': 1,
//         'tyId': 1,
//         'speciId': 1,
//         'gdMarketPrice': '3000',
//         'gdCostPrice': '20',
//         'gdIntro': '普洱茶云南省的西双版纳、临沧、普洱等地区，大乔木，高达16米，嫩枝有微毛，顶芽有白柔毛。叶薄革质，椭圆形。花腋生，被柔毛。苞片2，早落。萼片5，近圆形，外面无毛。花瓣6-7片，倒卵形，无毛。雄蕊长8-10毫米，离生，无毛。子房3室，被茸毛；花柱长8毫米，先端3裂。蒴果扁三角球形。种子每室1个，近圆形，直径1厘米。 [1] \n' +
//             '普洱茶讲究冲泡技巧和品饮艺术，可清饮，可混饮。普洱茶茶汤橙黄浓厚，香气高锐持久，香型独特，滋味浓醇，经久耐泡。',
//         'gdAmount': 9999
//     }
//     return Result
// })