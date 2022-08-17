import axios from 'axios';

//获取所有的菜单
export const getMenuList = () => { return axios.get("/menu/getList").then(res => res.data) };