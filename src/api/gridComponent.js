import axios from 'axios';

//新增
export const addComponentConfig = (params) => { return axios.post("/monitor/screenGridComponent/add", params)
.then(res => res.data) };

//更新
export const updateComponentConfig = (params) => { return axios.post("/monitor/screenGridComponent/update", params)
.then(res => res.data) };


//查询
export const getComponentConfig = (layoutCode, componentCode) => { return axios.get("/monitor/screenGridComponent/get?layoutCode=" + layoutCode
+"&componentCode=" + componentCode)
.then(res => res.data) };

//查询列表
export const getListComponentConfig = (layoutCode) => { return axios.get("/monitor/screenGridComponent/getList?layoutCode=" + layoutCode)
.then(res => res.data) };

//删除
export const deleteComponentConfig = (params) => { return axios.post("/monitor/screenGridComponent/delete", params)
.then(res => res.data) };

//查询外部接口数据
export const queryComponentConfig = (layoutCode, componentCode) => { return axios.get("/monitor/screenGridComponent/requestByParameter?layoutCode=" + layoutCode
+"&componentCode=" + componentCode)
.then(res => res.data) };