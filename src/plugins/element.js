import Vue from 'vue'
import { Switch, Tooltip, Dialog, Pagination, Table, TableColumn, Row, Col, Form, Input, FormItem, Icon, Button, Message, MessageBox, Container, Header, Aside, Main, Submenu, MenuItem, Menu, Breadcrumb, BreadcrumbItem, Card } from 'element-ui'

Vue.use(Row)
Vue.use(Col)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Icon)
Vue.use(Button)
Vue.use(Message.name)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch) 
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
