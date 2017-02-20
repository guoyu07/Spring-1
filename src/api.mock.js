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
    name: 'some-checkbox',
    description: '多选',
    required: true,
    type: 'checkbox',
    value: {
      checkboxTypeCode: 'checkboxOne',
      value: ['选项 1', '选项 3']
    }
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
  url: '/dictData/dictOne',
  response: [{
    name: '选项 1-1',
    value: 'dict-1-1',
    children: ['dict-2-1', 'dict-2-2']
  }, {
    name: '选项 1-2',
    value: 'dict-1-2',
    children: ['dict-2-3', 'dict-2-4']
  }]
}, {
  method: 'GET',
  url: '/dictData/dictTwo',
  dependOn: 'dictOne',  // 所依赖的字典的 dictTypeCode
  response: [{
    name: '选项 2-1',
    value: 'dict-2-1'
  }, {
    name: '选项 2-2',
    value: 'dict-2-2'
  }]
}, {
  method: 'GET',
  url: '/checkboxData/checkboxOne',
  response: [{
    name: '选项 1',
    value: 'check-1'
  }, {
    name: '选项 2',
    value: 'check-2'
  }, {
    name: '选项 3',
    value: 'check-3'
  }]
}, {
  method: 'GET',
  url: '/deviceData',
  response: [{
    id: 1,
    name: '设备一',
    number: '1234567890',
    other: 'xxxx'
  }, {
    id: 2,
    name: '设备二',
    number: '2345678901',
    other: 'xxxx'
  }]
}, {
  method: 'GET',
  url: '/equipmentData',
  response: [{
    id: 1,
    name: '设备一',
    number: '1234567890',
    other: 'xxxx',
    os: 'Windows',
    db: 'mongodb',
    agent: true,
    ip: '1.1.1.1',
    port: '80',
    ubit: '3',
    cabinet: '4',
    room: '5',
    app: 'xxx'
  }, {
    id: 2,
    name: '设备二',
    number: '1234567890',
    os: 'Windows',
    db: 'mongodb',
    agent: true,
    other: 'xxxx',
    ip: '1.1.1.1',
    port: '80',
    ubit: '3',
    cabinet: '4',
    room: '5',
    app: 'xxx'
  }]
}, {
  method: 'GET',
  url: '/searchKeys/server',
  response: [{
    name: 'it-number',
    label: 'IT 资产编号',
    value: ''
  }, {
    name: 'order',
    label: '订单号',
    value: ''
  }, {
    name: 'manufacturer',
    label: '制造商',
    value: ''
  }, {
    name: 'model',
    label: '型号',
    value: ''
  }, {
    name: 'cpu',
    label: 'CPU',
    value: ''
  }, {
    name: 'storage',
    label: '内存',
    value: ''
  }, {
    name: '所属应用服务',
    label: 'app',
    value: ''
  }, {
    name: 'ip',
    label: 'IP',
    value: ''
  }, {
    name: 'os',
    label: 'OS',
    value: ''
  }]
}, {
  method: 'GET',
  url: '/searchKeys/network',
  response: [{
    name: 'she',
    label: '网络设备',
    value: ''
  }, {
    name: 'storage',
    label: '网络设备',
    value: ''
  }, {
    name: '网络设备',
    label: 'app',
    value: ''
  }, {
    name: 'ip',
    label: '网络设备',
    value: ''
  }, {
    name: 'os',
    label: 'OS',
    value: ''
  }]
}, {
  method: 'GET',
  url: '/searchKeys/storage',
  response: [{
    name: '所属应用服务',
    label: '存储设备',
    value: ''
  }, {
    name: 'ip',
    label: '存储设备',
    value: ''
  }, {
    name: 'os',
    label: '存储设备',
    value: ''
  }]
}, {
  method: 'GET',
  url: '/searchKeys/others',
  response: [{
    name: '其他',
    label: '其他',
    value: ''
  }, {
    name: '其他',
    label: '其他',
    value: ''
  }, {
    name: '其他',
    label: '其他',
    value: ''
  }]
}, {
  method: 'GET',
  url: '/idclist',
  response: {
    idclist: [{
      label: 'idc11',
      value: 'idc1'
    }, {
      label: 'idc22',
      value: 'idc2'
    }, {
      label: 'idc33',
      value: 'idc1z'
    }, {
      label: 'idc44',
      value: 'idc1zzz'
    }],
    idcGroupList: [{
      label: '集群1',
      value: 'idcGroup1'
    }, {
      label: '集群2',
      value: 'idcGroup2'
    }, {
      label: '集群3',
      value: 'idcGroup1z'
    }, {
      label: '集群4',
      value: 'idcGroup1zzz'
    }]
  }
}, {
  method: 'GET',
  url: '/applylist',
  response: [{
    applyType: '新建应用',
    project: '前端组',
    applicationName: '阿里影业',
    data: [{
      host: '物理机',
      envirnment: '质量测试环境',
      number: 2,
      operationSystem: 'Red Hat5.5(应用)',
      score: 23.5,
      hardDisk: 2,
      internalStorage: 2,
      cpu: 4
    }]
  }, {
    applyType: '新建业务',
    project: '项目组',
    applicationName: '阿里巴巴',
    data: [{
      host: '物理机',
      envirnment: '质量测试环境',
      number: 2,
      operationSystem: 'Red Hat5.5(应用)',
      score: 23.5,
      hardDisk: 2,
      internalStorage: 2,
      cpu: 4
    }, {
      host: '物理机',
      envirnment: '预上线环境',
      number: 2,
      operationSystem: 'WinXP',
      score: 23.5,
      hardDisk: 2,
      internalStorage: 2,
      cpu: 4
    }, {
      host: '虚拟机',
      envirnment: '生产环境',
      number: 2,
      operationSystem: 'Win7',
      score: 23.5,
      hardDisk: 2,
      internalStorage: 2,
      cpu: 4
    }, {
      host: '虚拟机',
      envirnment: '生产环境',
      number: 2,
      operationSystem: 'Win7',
      score: 23.5,
      hardDisk: 2,
      internalStorage: 2,
      cpu: 4
    }]
  }]
}]

export default apis
