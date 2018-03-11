import Vue from 'vue'
import Router from 'vue-router'

const Me = r => require.ensure([], () => r(require('../components/me/me')), 'me')
const Login = r => require.ensure([], () => r(require('../components/login/login')), 'login')
const Manage = r => require.ensure([], () => r(require('../components/manage/manage')), 'manage')
const Apply = r => require.ensure([], () => r(require('../components/apply/apply')), 'apply')
const Disease = r => require.ensure([], () => r(require('../components/apply/disease/disease')), 'disease')
const IndexPage = r => require.ensure([], () => r(require('../components/index/index')), 'index')
const Setting = r => require.ensure([], () => r(require('../components/me/setting/setting')), 'setting')
const SelectCls = r => require.ensure([], () => r(require('../components/search/select-class/select-class')), 'select-class')
const ChangePwd = r => require.ensure([], () => r(require('../components/me/change-password/change-password')), 'change-password')
const OperateDetail = r => require.ensure([], () => r(require('../components/detail/operate-detail/operate-detail')), 'operate-detail')
const InputStuNum = r => require.ensure([], () => r(require('../components/operate/input-stu-number/input-stu-number')), 'input-stu-number')
const Mesystem = r => require.ensure([], () => r(require('../components/mesystem/mesystem')), 'mesystem')
const MesystemSubItem = r => require.ensure([], () => r(require('../components/mesystem/subitem/subitem')), 'subitem')
const MesystemSubItemDetail = r => require.ensure([], () => r(require('../components/mesystem/subitem-detail/subitem-detail')), 'subitem-detail')
const ProcessDisease = r => require.ensure([], () => r(require('../components/apply/process-disease/process-disease')), 'process-disease')
const ProcessVerify = r => require.ensure([], () => r(require('../components/apply/process-verify/process-verify')), 'process-verify')
const ProcessSuccess = r => require.ensure([], () => r(require('../components/apply/process-success/process-success')), 'process-success')
const PerformOperate = r => require.ensure([], () => r(require('../components/operate/perform-operate/perform-operate')), 'perform-operate')
const PerformClsOperate = r => require.ensure([], () => r(require('../components/operate/perform-cls-operate/perform-cls-operate')), 'perform-cls-operate')
const OperateClass = r => require.ensure([], () => r(require('../components/operate/operate-class/operate-class')), 'operate-class')
const SearchStuScore = r => require.ensure([], () => r(require('../components/search/search-stu-score/search-stu-score')), 'search-stu-score')
const ClassStudent = r => require.ensure([], () => r(require('../components/search/select-class-student/select-class-student')), 'select-class-student')
const SearchResultList = r => require.ensure([], () => r(require('../components/operate/search-result-list/search-result-list')), 'search-result-list')
const MyOperateDetailList = r => require.ensure([], () => r(require('../components/detail/my-operate-detail-list/my-operate-detail-list')), 'my-operate-detail-list')
const StuOperateDetailList = r => require.ensure([], () => r(require('../components/search/stu-operate-detail-list/stu-operate-detail-list')), 'stu-operate-detail-list')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '', // 如果url为空则调到登陆界面
      redirect: '/login'
    },
    {
      path: '/login',  // 登陆界面
      component: Login
    },
    {
      path: '/manage',
      component: Manage,
      children: [
        {
          path: '/index', // 首页
          component: IndexPage,
          children: [
            {
              path: '/inputStudentNumber', // 操作学生积分
              component: InputStuNum,
              children: [
                {
                  path: 'searchResultList', // 搜索结果
                  component: SearchResultList,
                  children: [
                    {
                      path: 'performOperate', // 执行操作
                      component: PerformOperate
                    }
                  ]
                },
                {
                  path: 'classStudent', // 点击常用班级
                  component: ClassStudent,
                  children: [
                    {
                      path: 'performOperate', // 执行操作
                      component: PerformOperate
                    }
                  ]
                },
                {
                  path: 'selectStudentScore', // 选择校区
                  component: SearchStuScore,
                  children: [
                    {
                      path: 'selectClass', // 选择班级
                      component: SelectCls,
                      children: [
                        {
                          path: 'classStudent', // 选择学生
                          component: ClassStudent,
                          children: [
                            {
                              path: 'performOperate', // 执行操作
                              component: PerformOperate
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              path: '/searchStudentScore', // 查询学生积分
              component: SearchStuScore,
              children: [
                {
                  path: 'selectClass', // 选择班级
                  component: SelectCls,
                  children: [
                    {
                      path: 'classStudent', // 选择学生
                      component: ClassStudent,
                      children: [
                        {
                          path: 'studentOperateDetailList', // 学生详情列表
                          component: StuOperateDetailList,
                          children: [
                            {
                              path: 'studentOperateDetail', // 学生详情
                              component: OperateDetail
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              path: '/myOperateDetailList', // 我的(被)操作记录列表
              component: MyOperateDetailList,
              children: [
                {
                  path: 'myOperateDetail', // 记录详情
                  component: OperateDetail
                }
              ]
            },
            {
              path: '/operateClsScore', // 选择操作班级积分
              component: OperateClass,
              children: [
                {
                  path: 'selectStudentScore', // 选择校区
                  component: SearchStuScore,
                  children: [
                    {
                      path: 'selectClass', // 选择班级
                      component: SelectCls,
                      children: [
                        {
                          path: 'performClsOperate', // 执行操作
                          component: PerformClsOperate
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              path: '/apply',
              component: Apply,
              children: [
                {
                  path: 'disease', // 申请请假
                  component: Disease
                },
                {
                  path: 'processDisease', // 审核请假
                  component: ProcessDisease,
                  children: [
                    {
                      path: 'processVerify',
                      component: ProcessVerify,
                      children: [
                        {
                          path: 'processSuccess',
                          component: ProcessSuccess
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          path: '/me', // 我的
          component: Me,
          children: [
            {
              path: '/setting', // 设置
              component: Setting,
              children: [
                {
                  path: 'changePassword', // 修改密码
                  component: ChangePwd
                }
              ]
            },
            {
              path: '/mesystem', // 查看十项常规 && 选择第几周的星期几
              component: Mesystem,
              children: [
                {
                  path: 'subitem', // 星期几的十项常规情况
                  component: MesystemSubItem,
                  children: [
                    {
                      path: 'subitemDetail', // 十项常规情况详情
                      component: MesystemSubItemDetail,
                      children: [
                        {
                          path: 'mesystemOperateDetail', // 记录详情
                          component: OperateDetail
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
})
