// 遍历dom结构，解析指令和插值表达式{{}}
class Compile{
    // el待编译的模板；vm：k-vue组件实例
    constructor(el,vm){
        // #app
        this.$el = document.querySelector(el);
        this.$vm = vm;

        if(this.$el){
            // 把模板中的内容移到片段中操作
            this.$fragment = this.node2Fragment(this.$el);
            // 执行编译
            this.compile(this.$fragment);
            // 放回$el中
            this.$el.appendChild(this.$fragment);
        }
    }

    node2Fragment(el){
        // 创建片段，在片段中操作，游离于dom文章，浏览器不会刷新
        const fragment = document.createDocumentFragment();
        let child;
        while(child = el.firstChild){
            // appendChild 属于移动操作
            fragment.appendChild(child)
        }
        return fragment;
    }

    compile(el){
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if(node.nodeType === 1){
                //console.log('变异元素节点'+node.nodeName);
                this.compileElement(node);
            }else if(this.interpolation(node)){
                // 只关心{{xxx}}
                this.compileText(node);
                //console.log("编译差值文本"+node.textContent);
            }
            //递归子节点
            if(node.childNodes && node.childNodes.length > 0){ //存在子节点并且不是空标签
                this.compile(node);
            }
        })
    }

    //是文本且符合{{}}
    interpolation(node){
        //(.*) 正则表示任意字符任意长度
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }

    compileText(node){
        console.log(RegExp.$1);
        console.log(this.$vm[RegExp.$1]);
        // 表达式
        const exp = RegExp.$1;
        this.update(node,exp,'text');
    }

    update(node,exp,dir){
        const updator = this[dir+'Updator'];
        updator && updator(node,this.$vm[exp]);//首次初始化
        // 创建watcher实例，依赖收集完成
        new Watcher(this.$vm,exp,function(value){
            updator && updator(node,value);
        })
    }
    
    textUpdator(node,value){
        node.textContent = value;
    }

    compileElement(node){
        //只关心属性
        const nodeAttrs = node.attributes;  //获取该节点的所有属性
        Array.from(nodeAttrs).forEach(attr => {
            //k-xxx="yyy"
            const attrName = attr.name;  //k-xxx
            const exp = attr.value;  //yyy
            if(attrName.indexOf("k-") === 0){
                // 得到指令
               const dir = attrName.substring(2);  //xxx
                // 执行
                this[dir] && this[dir](node,exp);
            }
        })
    }

    text(node,exp){
        this.update(node,exp,'text');
    }
}