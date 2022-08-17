const Mock = require('mockjs')
Mock.mock('/menu/getList', 'get', require('./json/menu.json'))



Mock.mock('/monitor/screenGridComponent/getList?layoutCode=test1', 'get', require('./json/test1/layout.json'))
Mock.mock('/monitor/screenGridComponent/get?layoutCode=test1&componentCode=table1', 'get', require('./json/test1/table1Config.json'))
Mock.mock('/monitor/screenGridComponent/requestByParameter?layoutCode=test1&componentCode=table1', 'get', require('./json/test1/table1Data.json'))



Mock.mock('/monitor/screenGridComponent/getList?layoutCode=test2', 'get', require('./json/test2/layout.json'))
Mock.mock('/monitor/screenGridComponent/get?layoutCode=test2&componentCode=table2', 'get', require('./json/test2/table2config.json'))
Mock.mock('/monitor/screenGridComponent/requestByParameter?layoutCode=test2&componentCode=table2', 'get', require('./json/test2/table2Data.json'))



Mock.mock('/monitor/screenGridComponent/getList?layoutCode=test3', 'get', require('./json/test3/layout.json'))
Mock.mock('/monitor/screenGridComponent/get?layoutCode=test3&componentCode=head', 'get', require('./json/test3/headerConfig.json'))

Mock.mock('/monitor/screenGridComponent/get?layoutCode=test3&componentCode=digital1', 'get', require('./json/test3/digital1Config.json'))
Mock.mock('/monitor/screenGridComponent/requestByParameter?layoutCode=test3&componentCode=digital1', 'get', require('./json/test3/digital1Data.json'))

Mock.mock('/monitor/screenGridComponent/get?layoutCode=test3&componentCode=table3', 'get', require('./json/test3/table3Config.json'))
Mock.mock('/monitor/screenGridComponent/requestByParameter?layoutCode=test3&componentCode=table3', 'get', require('./json/test3/table3Data.json'))



//更新
Mock.mock('/monitor/screenGridComponent/update', 'post', require('./json/suc.json'))
//add
Mock.mock('/monitor/screenGridComponent/add', 'post', require('./json/suc.json'))