const apis = [{
  method: 'GET',
  url: '/inputParams',
  response: [{
    name: 'some-text',
    description: '输入框',
    required: false,
    type: 'text',
    value: 'lorem ipsum'
  }, {
    name: 'some-num',
    description: '数值',
    required: true,
    type: 'number',
    value: 10
  }, {
    name: 'some-dict',
    description: '选择框 1',
    required: true,
    type: 'dict',
    value: {
      dictTypeCode: 'dictOne',
      dictTypeName: '字典 1',
      name: '选项 1-2',
      value: 'dict-1-2'
    }
  }, {
    name: 'some-textarea',
    description: '文本框',
    required: false,
    type: 'textarea',
    value: 'Lorem ipsum dolor sit amet, consectetur.'
  }, {
    name: 'another-dict',
    description: '选择框 2',
    required: false,
    type: 'dict',
    value: {
      dictTypeCode: 'dictTwo',
      dictTypeName: '字典 2',
      name: '选项 2-1',
      value: 'dict-2-1'
    }
  }]
}, {
  method: 'GET',
  url: 'dictData/dictOne',
  response: [{
    name: '选项 1-1',
    value: 'dict-1-1'
  }, {
    name: '选项 1-2',
    value: 'dict-1-2'
  }]
}, {
  method: 'GET',
  url: 'dictData/dictTwo',
  response: [{
    name: '选项 2-1',
    value: 'dict-2-1'
  }, {
    name: '选项 2-2',
    value: 'dict-2-2'
  }]
}]

export default apis
