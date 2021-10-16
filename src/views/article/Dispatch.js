import React from 'react';
import { Form, message, Card } from 'antd';
import http from '@/server.js';
import  GroupForm from '../../components/GroupForm';
// 发布文章
class Dispatch extends React.Component {
  state = {
    tagsEnums: [], // 标签下拉值,
    formData: {} //表单详情值,
  };
  componentDidMount() {
    this.mode = this.props.location.query === undefined ? 'Add' : 'Edit';
    this.fetchTagData();
    // 表单字段初始化
    if (this.mode === 'Edit') {
      let { title, content, tags } = this.props.location.query;
      let formData = {
        title,
        content,
        tags
      };
      this.setState({
        formData
      });
    }
  }
  mode = 'Add'; // 新增编辑模式
  // 其他配置
  otherConfig = {};
  // 按钮列表
  btns = [
    {
      name: 'submit',
      text:  this.mode === 'Edit' ? '更新' : '发文'
    },
    {
      name: 'save'
    }
  ]
  // 发文提交
  handleSubmit = async (action, values) => {
    let param = this.getParams(action);
    let params =
      this.mode === 'Add'
        ? {
          ...param,
          ...values
        }
        : {
          ...this.props.location.query,
          ...param,
          ...values
        };
    let url =
      this.mode === 'Add'
        ? '/api/articles/dispatch'
        : '/api/articles/update';
    let returnObj = await http.post(url, params);
    if (returnObj.code === 200) {
      //发文成功
      message.success(returnObj.message);
      this.props.history.push({ pathname: '/index/Article' });
    } else if (returnObj.code === 400) {
      message.info(returnObj.message);
    } else {
      message.info(returnObj.message);
    }
  };
  // 拼接参数 status
  getParams(action) {
    // 拼接草稿状态字段
    let status = action === 'submit' ? 1 : 0;
    return {
      status
    };
  }
  /**
   * 获取标签下拉值
   */
  async fetchTagData() {
    let url = '/api/tags/query';
    let returnObj = await http.post(url);
    if (returnObj.code === 200) {
      this.otherConfig.tagsEnums = returnObj.data;
      this.setState({
        tagsEnums: this.otherConfig.tagsEnums
      });
    } else if (returnObj.code === 400) {
      message.info(returnObj.message);
    } else {
      message.info(returnObj.message);
    }
  }
  /**
   * 获取表单配置项
   * @param {*} otherConfig
   * @returns
   */
  getFields(otherConfig){
    let fields = [{
      groupLabel: '',
      groupName: '',
      groupSeq: '0',
      groupType: '',
      hasInnerGroup: true,
      rows: [
        {
          fieldName: 'title',
          fieldLabel: '标题',
          fieldType: 'INPUT',
          initValue: '',
          required: '1',
          placeholder: '请输入'
        },
        {
          fieldName: 'content',
          fieldLabel: '文章',
          fieldType: 'TEXTAREA',
          initValue: '',
          required: '1',
          placeholder: '请输入',
          initStyle: { rows: '22' }
        },
        {
          fieldName: 'tags',
          fieldLabel: '标签',
          fieldType: 'SELECT',
          initValue: '',
          required: '1',
          placeholder: '请选择',
          enums: otherConfig.tagsEnums || []
        }
      ]
    }];
    return fields;
  }
  /**
   * 渲染函数
   * @returns
   */
  render() {
    const { formData } = this.state;
    return (
      <div className="dispatch-wrapper">
        <Card>
          <GroupForm
            fields={this.getFields(this.otherConfig)}
            mode={this.mode}
            handleSubmit={this.handleSubmit}
            formData={formData}
            btns={this.btns}
          />
        </Card>
      </div>
    );
  }
}
export default Form.create({ name: 'normal_dispatch' })(Dispatch);
