import Vue from 'vue'
import { Row, Col, Form, Input, FormItem, Icon, Button, Message, MessageBox } from 'element-ui'

Vue.use(Row)
Vue.use(Col)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Icon)
Vue.use(Button)
Vue.use(Message.name)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
