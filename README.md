# kvue

### 介绍

基于vue1.0没有vnode，实现数据响应式，利用典型的发布订阅模式（Dep->Watcher)。

实现compile编译，遍历dom结构，解析指令和插值表达式{{}}。

####  vue数据响应化过程：

- observe劫持

  observe劫持所有属性，并且是一个递归操作

  借助于vue的Object.definProperty，给对象（obj)的每一个属性(key)进行拦截，把属性转换为getter&setter

  

- 在vue根上定义属性代理  this.$data.xxx === this.xxx

  proxyData(key)  借助于vue的Object.defineProperty(Kvue,key{get(),set(newVal)})

  

- 为每一个data中的属性（key）绑定一个dep

  dep发布者，管理所有的watcher

  

- 订阅者 watcher 和页面data中的key存在挂钩关系

![image](https://github.com/qyuanq/kvue/blob/master/dep.jpg)
#### 编译:



![image-20200324134122017](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20200324134122017.png)
