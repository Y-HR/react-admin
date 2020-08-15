import React, { Component, Fragment } from "react";
// 
import { Link } from "react-router-dom";
// antd
import { Form, Input, Button, Switch, message, Modal } from "antd";
// api
import { Delete, Status } from "@api/department";
// table 组件
import TableComponent from "@c/tableData/Index";
class DepartmentList extends Component {
    constructor(props){
        super(props);
        this.state = {
            // id
            id: "",
            // flag
            flag: false,
            // 请求参数
            pageNumber: 1,
            pageSize: 10,
            keyWork: "",
            // 表头
            tableConfig: {
                url: "departmentList",
                checkbox: true,
                rowkey: "id",
                thead: [
                    { title: "部门名称", dataIndex: "name", key: "name" },
                    { 
                        title: "禁启用", 
                        dataIndex: "status", 
                        key: "status",
                        render: (text, rowData) => {
                            return <Switch onChange={() => this.onHandlerSwitch(rowData)} loading={rowData.id == this.state.id} checkedChildren="启用" unCheckedChildren="禁用" defaultChecked={rowData.status === "1" ? true : false} />
                        }
                    },
                    { title: "人员数量", dataIndex: "number", key: "number" },
                    { 
                        title: "操作", 
                        dataIndex: "operation", 
                        key: "operation", 
                        width: 215,
                        render: (text, rowData) => {
                            return (
                                <div className="inline-button">
                                    <Button type="primary">
                                        <Link to={{ pathname: '/index/department/add', state:{ id: rowData.id}}}>编辑</Link>
                                    </Button>
                                    <Button onClick={() => this.delete(rowData.id)}>删除</Button>
                                    {/* 
                                        在父组件获取子组件的实例
                                        1、在子组件调用父组件方法，并把子组件实例传回给父组件，（已经存储了子组件的实例）
                                        2、通过实例调用子组件的方法
                                    */}
                                </div>
                            )
                        }
                    }
                ]
            },
            // 表的数据
            data: []
        };
    }
    /** 生命周期挂载完成 */
    componentDidMount(){}
    // 获取子组件实例
    getChildRef = (ref) => {
        this.tableComponent = ref; // 存储子组件
    }
    /** 搜索 */
    onFinish = (value) => {
        if(this.state.loadingTable) { return false }
        this.setState({
            keyWork: value.name,
            pageNumber: 1,
            pageSize: 10,
        })
    }
    /** 禁启用 */
    onHandlerSwitch(data){
        if(!data.status) { return false; }
        if(this.state.flag) { return false; }
        const requestData = {
            id: data.id,
            status: data.status === "1" ? false : true
        }
        // 第一种做法，用组件本身异步
        this.setState({id: data.id}) 
        // 第二种做法，自己做的开关
        // this.setState({flag: true}) 
        Status(requestData).then(response => {
            message.info(response.data.message);
            this.setState({id: ""})
            // this.setState({flag: false}) 
        }).catch(error => {
            this.setState({id: ""})
            // this.setState({flag: false}) 
        })
    }
    /** 删除 */
    delete = (id) => {
        this.tableComponent.onHandlerDelete(id)
    }
    render(){
        return (
            <Fragment>
                <Form layout="inline" onFinish={this.onFinish}>
                    <Form.Item label="部门名称" name="name">
                        <Input placeholder="请输入部门名称" />
                    </Form.Item>
                    <Form.Item shouldUpdate={true}>
                        <Button type="primary" htmlType="submit">搜索</Button>
                    </Form.Item>
                </Form>
                <div className="table-wrap">
                    <TableComponent onRef={this.getChildRef} batchButton={true} config={this.state.tableConfig} />
                </div>
            </Fragment>
        )
    }
}
export default DepartmentList;