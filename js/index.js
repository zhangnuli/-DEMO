var data = {
    message: [{
        left: '工作怎么样啊?',
        right: [{
            text: '不如你家孩子厉害,还要继续学习',
            score: 3
        },
            {
                text: '一般啦,比你家孩子好点',
                score: -2
            },
            {
                text: '领导经常叫我加班',
                score: 1
            }
        ]
    }, {
        left: '有对象了么?',
        right: [{
            text: '被你家孩子租回去过年了',
            score: -2
        },
            {
                text: '我还是个孩子,妈妈说不要早恋',
                score: 1
            },
            {
                text: '对象对我挺好的,谢谢关心',
                score: 3
            }
        ]
    }, {
        left: '工资多少啊?',
        right: [{
            text: '刚好比你家孩子多那么一点',
            score: -2
        },
            {
                text: '一般,我刚买个表',
                score: 1
            },
            {
                text: '不多,刚好够基本生活',
                score: 3
            }
        ]
    }, {
        left: '明年有什么打算呢?',
        right: [{
            text: '还没有什么打算',
            score: 1
        },
            {
                text: '多多努力,向你学习',
                score: 3
            },
            {
                text: '凑钱把房子买了,阿姨打算转给我多少红包呢',
                score: -2
            }
        ]
    },],
    result: [{
        score: 8,
        tips: '传说中别人家的孩子,给你99分,多一份怕你骄傲',
        say: '好孩子'
    },
        {
            score: 4,
            tips: '来年继续加油把!别人家的孩子都在虎视眈眈想超过你呢',
            say: '不错'
        }, {
            score: 0,
            tips: '恭喜你捡回一条名!来年可没有这么好运了,保重',
            say: '呵呵'
        }, {
            score: -10,
            tips: '请问你是怎么活过这么多年的?还是好好找个洞藏起来保命把',
            say: '这孩子怎么这样子'
        }
    ]
}

//自己封装一个快速选择的函数
function $(ele) {
    return document.querySelector(ele);
}

//自己封装一个快速添加class的方法
function addClass(element, className) {
    element.classList.add(className);
}

function removeClass(element, className) {
    element.classList.remove(className);
}

function hasClass(element, className) {
    return element.classList.contains(className);
}

var firstPage = $('.first-page');

//给第一页的点击继续绑定一个单击事件 点击的时候让第一页隐藏掉,并让star执行


function getDomByStr(str) {
    var p = document.createElement('p'); //生成一个p标签
    p.innerHTML = str; //让p的innerHTML等于我们传入的模板字符串
    return p.children[0]; //返回整个Dom就是p的第一个children
}

//定义一个函数,传入左右对话框 传入要输出的内容
function getMessage(side, str) {
    //利用ES6字符串模板的方法 生成DOM模板
    var template = `  <div class="message-item massage-item-${side}">
            <img class="avata" src="./image/${side == 'left' ? 'girl' : 'boy'}.jpg" alt="头像">
            <div class="massage-bue">
                <p>${str}</p>
            </div>
        </div>`
    return getDomByStr(template); //把生成的模板传入到函数中
}

//设置初始分数和初始对话
let step = 0; //保存当前是第几个问答
let score = 0; //设置分数初始值

function getMessag(msObj) {//利用ES6字符串模板的方法 生成DOM模板
    return `
    <div class="message-item massage-item-right  js-to-select"data.score=${msObj.score}>
            <img class="avata" src="./image/boy.jpg" alt="头像">
            <div class="massage-bue">
                <p>${msObj.text}</p>
            </div>
        </div>
    `
}

function changeMessage() {
    var curMes = data.message[step];////保存当前messages中step个问答
    var seleMsStr = '';
    curMes.right.forEach(//循环遍历当前右边的数组
        function (messages) {
            return seleMsStr += getMessag(messages);
        }

    )
    $('.message-select').innerHTML = seleMsStr;//让messages-select的innerHTML等于我们加载出来的内容
}

//给第一页的点击继续绑定一个单击事件 点击的时候让第一页隐藏掉,并让star执行
$('.js-context').onclick = function () {
    addClass(firstPage, 'fadeout');
    setTimeout(function () { //我们利用定时器做出淡入淡出的效果
        addClass(firstPage, 'hide');
        addClass($('.footer'), 'footer-bottom');
        addClass($('.message-select'), 'messages-bottom');
        star();
    }, 1000);

}
// 实现事件委托

$('.message-select').addEventListener('touchend', function (event) {
    var target = event.target;
    var currentTarget = event.currentTarget;
    while (target !== currentTarget) {
        if (hasClass(target, 'js-to-select')) {//判断当前点击的是否有js-to-select这个类名
            var currentScore =+target.getAttribute('data.score');
            var message = target.querySelector('.massage-bue').innerText;
            appendMessage('right', message);
            score += currentScore;
            nextStep();
            return
        }
        target = target.parentNode
    }
})

// $('.icon-replay').addEventListener('touchend',function (event) {window.location.reload()  })

function tagSele(isShow) {//定义一个是否显示还是隐藏的函数

    var chatPage = $('.chat-page');
    if (isShow) {//如果显示 增加一个类名
        addClass(chatPage, 'show-selector');
    } else {//否则 就删除类名
        removeClass(chatPage, 'show-selector');
    }
}

function nextStep() {
    tagSele(false);
    step += 1;//渲染下一条消息
    if (step >= data.message.length) {//判断什么时候结束
        showResult();//如果结束了 就显示结果
    } else {
        setTimeout(
            function () {//否则继续渲染下一条对话框
                star();
            }, 700)
    }
}

function getResultByScore (score) {
    const resultMsg = data.result
    let result;
    resultMsg.every((resultObj) => {
        if (score >= resultObj.score) {
        result = resultObj
        return false
    }
    return true
})
    return result
}

function showTips (resultObj) {
    var tips=$('.cover-tips');
    tips.querySelector('.tips-text').innerText = `分数：${score}
      ${resultObj.tips}`
    removeClass(tips, 'hide')
}
function showResult() {
    setTimeout(() => {
        // 显示左边最后的对话
        const resultObj = getResultByScore(score)
        // 延时 1s 显示结果窗口
        appendMessage('left', resultObj.say)
    // 显示结果窗口
    setTimeout(() => {
        showTips(resultObj)
    }, 1000)
}, 1000)
}

function appendMessage(side, str) {
    var messDom = getMessage(side, str); //定义一个变量 保存getMessage的结果

    $('.chat-list').append(messDom)
}


//写一个开始的函数
function star() { //定义一个函数 开始加载出来第一句的对话框
    var curMss = data.message[step]; //保存当前messages中step个问答
    // var messDom = getMessage('left', curMss.left); //定义一个变量 保存getMessage的结果
    //
    // $('.chat-list').append(messDom); //把messDom插入到页面中
    appendMessage('left', curMss.left)
    changeMessage();
    setTimeout(
        function () {
            tagSele(true);
        }, 700
    )
}
function tagSele(isShow) {

    var chatPage = $('.chat-page');
    if (isShow) {
        addClass(chatPage, 'show-selector');
    } else {
        removeClass(chatPage, 'show-selector');
    }
}

function nextStep() {
    tagSele(false);
    step += 1;//渲染下一条消息
    if (step >= data.message.length) {//判断什么时候结束
        showResult();
    } else {
        setTimeout(
            function () {
                star();
            }, 700)
    }
}

function getResultByScore (score) {
    const resultMsg = data.result;
    let result;
    resultMsg.every((resultObj) => {
        if (score >= resultObj.score) {
        result = resultObj;
        return false;
    }
    return true;
})
    return result;
}

function showTips (resultObj) {
    var tips=$('.cover-tips');
    tips.querySelector('.tips-text').innerText = `分数：${score}
      ${resultObj.tips}`;
    removeClass(tips, 'hide');
}
function showResult() {
    setTimeout(() => {
        // 显示左边最后的对话
        const resultObj = getResultByScore(score);
        // 延时 1s 显示结果窗口
        appendMessage('left', resultObj.say);
    // 显示结果窗口
    setTimeout(() => {
        showTips(resultObj);
    }, 1000)
}, 1000)
}


