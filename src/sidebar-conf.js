const SidebarConf = {
  Homepage: {
    title: '首页',
    routes: [{
      label: undefined,
      list: [{
        name: '流程中心',
        path: '/menu',
        icon: 'fa-sitemap'
      }, {
        name: '事件中心',
        path: '/event-hub',
        icon: 'fa-bullhorn'
      }, {
        name: '工单中心',
        path: '/orders',
        icon: 'fa-calendar-o'
      }, {
        name: '统计中心',
        path: '/statistics',
        icon: 'fa-pie-chart'
      }, {
        name: '配置中心',
        path: '/custom',
        icon: 'fa-cogs'
      }]
    }]
  },
  Process: {
    title: '流程中心',
    routes: [{
      label: '流程中心',
      list: [{
        name: '服务目录',
        path: '/menu',
        icon: 'fa-dashboard'
      }, {
        name: '工单列表',
        path: '/orders/queues/filter_type_handle',
        icon: 'fa-calendar-o'
      }, {
        name: '统计中心',
        path: '/statistics',
        icon: 'fa-pie-chart'
      }]
    }, {
      label: '流程设置',
      list: [{
        name: '流程管理员设置',
        path: '/process-admin/basics',
        icon: 'fa-circle-o-notch'
      }, {
        name: '环节权限设置',
        path: '/process-admin/steps',
        icon: 'fa-circle-o'
      }, {
        name: '流程自定义',
        path: '/custom',
        icon: 'fa-sitemap'
      }, {
        name: '表单自定义',
        path: '/forms',
        icon: 'fa-wpforms'
      }]
    }]
  },
  Event: {
    title: '事件中心',
    routes: [{
      label: '事件中心',
      list: [{
        name: 'Dashboard',
        path: '/',
        icon: 'fa-dashboard'
      }, {
        name: '新建事件',
        path: '/',
        icon: 'fa-question'
      }, {
        name: '事件列表',
        path: '/event-hub',
        icon: 'fa-bullhorn'
      }, {
        name: '统计中心',
        path: '/statistics',
        icon: 'fa-pie-chart'
      }]
    }, {
      label: '事件设置',
      list: [{
        name: '事件自定义',
        path: '/event-config/details',
        icon: 'fa-cogs'
      }, {
        name: 'SLA',
        path: '/sla',
        icon: 'fa-clock-o'
      }]
    }]
  },
  Question: {},
  Orders: {
    title: '工单中心',
    routes: [{
      label: '工单中心',
      list: [{
        name: 'Dashboard',
        path: '/menu',
        icon: 'fa-dashboard'
      }, {
        name: '流程工单列表',
        path: '/orders',
        icon: 'fa-calendar-o'
      }, {
        name: '事件工单列表',
        path: '/event-hub',
        icon: 'fa-bullhorn'
      }, {
        name: '问题工单列表',
        path: '',
        icon: 'fa-question-circle'
      }, {
        name: '工作量统计',
        path: '',
        icon: 'fa-line-chart'
      }]
    }, {
      label: '工作编排',
      list: [{
        name: '标准工时设置',
        path: '',
        icon: 'fa-clock-o'
      }, {
        name: '日历排班设置',
        path: '',
        icon: 'fa-calendar-check-o'
      }]
    }]
  },
  Statistics: {
    title: '统计中心',
    routes: [{
      label: undefined,
      list: [{
        name: '流程统计',
        path: '',
        icon: 'fa-sitemap'
      }, {
        name: '事件统计',
        path: '',
        icon: 'fa-bullhorn'
      }, {
        name: '自定义统计',
        path: '',
        icon: 'fa-gear'
      }]
    }]
  },
  Personal: {
    title: '我的账户',
    routes: [{
      label: undefined,
      list: [{
        name: '基本信息',
        path: '/account/basics',
        icon: 'fa-user-o'
      }, {
        name: '修改密码',
        path: '/account/password',
        icon: 'fa-unlock-alt'
      }]
    }]
  },
  Accounts: {
    title: '账户管理',
    routes: [{
      label: undefined,
      list: [{
        name: '用户管理',
        path: '/auth/users',
        icon: 'fa-user'
      }, {
        name: '角色管理',
        path: '/auth/roles',
        icon: 'fa-users'
      }]
    }]
  },
  Auth: {
    title: '权限管理',
    routes: [{
      label: '流程相关',
      list: [{
        name: '流程管理员',
        path: '/process-admin/basics',
        icon: 'fa-circle-o-notch'
      }, {
        name: '环节权限设置',
        path: '/process-admin/steps',
        icon: 'fa-circle-o'
      }]
    }, {
      label: '事件相关',
      list: [{
        name: '事件权限管理',
        path: '',
        icon: 'fa-circle'
      }]
    }]
  },
  System: [{
    label: '流程设置',
    list: [{
      name: '流程自定义',
      path: '/custom',
      icon: 'fa-sitemap'
    }, {
      name: '表单自定义',
      path: '/forms',
      icon: 'fa-wpforms'
    }]
  }, {
    label: '事件设置',
    list: [{
      name: '事件自定义',
      path: '/event-config/details',
      icon: 'fa-cogs'
    }, {
      name: 'SLA',
      path: '/sla',
      icon: 'fa-clock-o'
    }, {
      name: '服务等级设置',
      path: '',
      icon: 'fa-sliders'
    }]
  }, {
    label: '系统设置',
    list: [{
      name: 'API 预选集设置',
      path: '',
      icon: 'fa-plug'
    }, {
      name: '表单模板库',
      path: '',
      icon: 'fa-wpforms'
    }, {
      name: '流程模板库',
      path: '',
      icon: 'fa-sitemap'
    }]
  }],
  Help: [{
    label: undefined,
    list: [{
      name: '流程相关',
      path: '',
      icon: 'fa-sitemap'
    }, {
      name: '事件相关',
      path: '',
      icon: 'fa-bullhorn'
    }, {
      name: '权限设置',
      path: '/auth/users',
      icon: 'fa-unlock-alt'
    }, {
      name: '系统通用设置',
      path: '',
      icon: 'fa-gear'
    }]
  }]
}

export default SidebarConf
