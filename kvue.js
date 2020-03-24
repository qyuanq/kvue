class kvue{
    constructor(options){
        this.$options = options;
        this.$data = options.data;
        // 响应化
        this.observe(this.$data);

        // new Watcher(this,'name');
        // this.name;

        new Compile(options.el,this);

        if(options.created){
            options.created.call(this);
        }
    }

    observe(value){
        if(!value || typeof value !== 'object'){
            return;
        }
        // 遍历对象
        Object.keys(value).forEach(key => {
            this.defineReactive(value,key,value[key]);
            this.proxyData(key);
        })
    }

    defineReactive(obj,key,val){
        //递归遍历
        this.observe(val);

        //定义一个dep
        const dep = new Dep();

        // 给obj的每一个Key定义拦截，把属性转换为getter/setter
        Object.defineProperty(obj,key,{
            get(){
                //依赖收集
                Dep.target && dep.addDep(Dep.target);
               // console.log('获取'+val);
                return val;
            },
            set(newVal){
                if(newVal !== val){
                    val = newVal;
                  // console.log(val+'更新了');
                  //通知dep更新
                  dep.notify();
                }
            }
        })
    }

    // 代理  在vue根上定义属性代理data中的数据
    proxyData(key){
        // 这里的this是vue实例，所属kvue内
        Object.defineProperty(this,key,{
            get(){
                return this.$data[key];
            },
            set(newVal){
                this.$data[key] = newVal;
            }
        })
    }
}

//创建dep管理所有watcher
class Dep{
    constructor(){
        this.watchers = [];
    }
    addDep(watcher){
        this.watchers.push(watcher);
    }
    notify(){
        this.watchers.forEach(watcher => watcher.update())
    }
}

class Watcher{
    //vm组件实例  key:data的key(属性)
    constructor(vm,key,cb){
        this.vm = vm;
        this.key = key;
        this.cb = cb;

        // 创建watcher实例时立刻将该实例指向Dep.target便于依赖收集
        Dep.target = this;
        this.vm[this.key];//触发依赖收集
        Dep.target = null;
    }
    update(){
        //console.log(this.key+'更新了');
        this.cb.call(this.vm,this.vm[this.key]);
    }
}