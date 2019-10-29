window.addEventListener('load', function () {
    animation.headerSearchChange();
    animation.downTime();
    animation.goTop();
    animation.lunbo_native();
    animation.nav_slide();
    animation.text_scroll();
    // animation.touch_solid();
});
var animation = {
    //判断时间是否是小于10的,如是则在前面加"0"
    tool: {
        zero: function (m) {
            return m < 10 ? "0" + m : m
        },
        translate: function (obj, disX) {
            obj.style.transform = disX;
            obj.style.webkitTransform = disX;
        },
        addTrans: function (obj) {
            obj.style.transition = 'all 0.3s';
            obj.style.webkitTransition = 'all 0.3s';
        },
        transitionend: function (dom, callback) {
            if (dom && typeof dom == 'object') {
                dom.addEventListener('transitionend', function (e) {
                    (typeof callback == 'function') && callback.call(dom, e);
                })
                dom.addEventListener('webkitTransitionend', function (e) {
                    (typeof callback == 'function') && callback.call(dom, e);
                })
            }
        },
        removeTrans: function (obj) {
            obj.style.transition = 'none';
            obj.style.webkitTransition = 'none';
        }
    },
    headerSearchChange: function () {
        var lunboH = document.querySelector('.lunbo').offsetHeight;
        var header = document.querySelector('header');
        // 检测滚动变化
        window.addEventListener('scroll', function () {
            var iTop = document.documentElement.scrollTop;
            if (iTop > 10) {
                header.style.zIndex = 999;
                header.style.backgroundColor = "rgba(228,49,48," + (iTop / lunboH) + ")";
            } else {
                header.style.zIndex = 0;
            }
        })
    },
    // 倒计时
    downTime: function () {
        var newTime = 60 * 60 * 3;
        var allTime = document.querySelectorAll('.time>div');
        timeFun.bind(this);
        function timeFun() {
            newTime--;
            var h = parseInt(newTime / 3600);
            var m = parseInt(newTime % 3600 / 60);
            var s = parseInt(newTime % 60);
            if (newTime < 0) {
                clearInterval(timer);
                newTime = 0;
                return this.downTime();
            }
            allTime[0].innerHTML = this.tool.zero(h);
            allTime[1].innerHTML = this.tool.zero(m);
            allTime[2].innerHTML = this.tool.zero(s);
        }
        var timer = setInterval(timeFun.bind(this), 1000);
    },
    // 返回顶部
    goTop: function () {
        var goTop = document.querySelector('.goTop');
        goTop.style.display = 'none';
        window.addEventListener('scroll', function () {
            var iTop = document.documentElement.scrollTop;
            var vH = document.documentElement.clientHeight;
            if (iTop > vH) {
                goTop.style.display = 'block';
            } else {
                goTop.style.display = 'none';
            }
        });

        goTop.addEventListener('touchend', function () {
            var iTop = document.documentElement.scrollTop;
            var timer = setInterval(function () {
                iTop -= 50;
                if (iTop <= 0) {
                    clearInterval(timer);
                    iTop = 0;
                }
                document.documentElement.scrollTop = iTop;
            }, 10)
        })
    },
    //轮播图
    lunbo_native: function () {
        var lunbo = document.querySelector('.lunbo_cont');
        var lW = lunbo.querySelector('li').offsetWidth;

        var navs = document.querySelectorAll('.nav>ol>li');
        var first = lunbo.children[0].cloneNode(true);
        var last = lunbo.children[lunbo.children.length - 1].cloneNode(true);
        lunbo.appendChild(first);
        lunbo.insertBefore(last, lunbo.children[0]);
        var num = 1;
        this.tool.translate(lunbo, 'translateX(' + (-lW * num) + 'px)');
        var that = this;
        var timer = setInterval(function () {
            num++;
            that.tool.addTrans(lunbo);
            that.tool.translate(lunbo, 'translateX(' + (-lW * num) + 'px)');
        }, 2000);
        that.tool.transitionend(lunbo, function () {
            if (num >= navs.length + 1) {
                num = 1;
                that.tool.removeTrans(lunbo);
                that.tool.translate(lunbo, 'translateX(' + (-lW * num) + 'px)');
            }
            if (num <= 0) {
                num = navs.length;
                that.tool.removeTrans(lunbo);
                that.tool.translate(lunbo, 'translateX(' + (-lW * num) + 'px)');
            }
            document.querySelector('.nav>ol>li.active').classList.remove('active');
            navs[num - 1].classList.add('active');
        });


        //触摸轮播图
        //开始触摸点的X坐标

        var startX = 0;
        //滑动后的位置
        var moveX = 0;
        //滑动距离
        var disX = 0;
        // 是否滑动
        var isMove = false;
        lunbo.addEventListener('touchstart', function (e) {
            clearInterval(timer);
            // console.log(e);
            startX = e.touches[0].clientX;
        });
        lunbo.addEventListener('touchmove', function (e) {
            isMove = true;
            // console.log(e);
            moveX = e.touches[0].clientX;
            disX = moveX - startX;
            that.tool.removeTrans(lunbo);
            that.tool.translate(lunbo, 'translateX(' + (-iW * num + disX) + 'px)');
        });
        lunbo.addEventListener('touchend', function (e) {
            clearInterval(timer);
            // console.log(e);
            if (isMove) {
                if (Math.abs(disX) >= lW / 3) {
                    if (disX > 0) {
                        num--;
                    } else {
                        num++;
                    }
                }
                that.tool.addTrans(lunbo);
                that.tool.translate(lunbo, 'translateX(' + (-lW * num) + 'px)');

                startX = 0;
                moveX = 0;
                isMove = false;
                disX = 0;
                timer = setInterval(function () {
                    num++;
                    that.tool.addTrans(lunbo);
                    that.tool.translate(lunbo, 'translateX(' + (-lW * num) + 'px)');
                }, 2000);

            }
        });
    },
    nav_slide: function () {
        var slider = document.querySelector('.topList');
        var navs = document.querySelectorAll('.listCircle>li');
        var startX = 0;
        var moveX = 0;
        var isMove = false;
        var disX = 0;

        var flag = 0;
        var iW = slider.children[0].offsetWidth;

        slider.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
        })
        slider.addEventListener('touchmove', function (e) {
            isMove = true;
            moveX = e.touches[0].clientX;
            disX = moveX - startX;
            // console.log(disX)
        });
        slider.addEventListener('touchend', () => {
            if (isMove) {
                if (flag) {
                    if (disX > 0 && (Math.abs(disX) > iW / 3)) {
                        this.tool.addTrans(slider);
                        this.tool.translate(slider, 'translateX(' + 0 + 'px)');
                        this.tool.transitionend(slider, function () {
                            navs[1].classList.remove('active');
                            navs[0].classList.add('active');
                        });
                        flag = 0;
                    }
                } else {
                    if (disX < 0 && (Math.abs(disX) > iW / 3)) {
                        this.tool.addTrans(slider);
                        this.tool.translate(slider, 'translateX(' + (-iW) + 'px)');
                        this.tool.transitionend(slider, function () {
                            navs[0].classList.remove('active');
                            navs[1].classList.add('active');
                        });
                        flag = 1;
                    }
                }
            }
        });
    },
    text_scroll: function () {
        var oUl = document.querySelector('.jd_news>ul');
        var first = oUl.children[0].cloneNode(true);
        oUl.appendChild(first);
        var oLi = oUl.querySelectorAll('li');
        var iH = oLi[0].offsetHeight;
        var num = 0;
        setInterval(function () {
            num++;
            this.tool.addTrans(oUl);
            this.tool.translate(oUl, "translateY(" + (-iH * num) + "px)");
            this.tool.transitionend(oUl, function () {
                if (num >= oLi.length - 1) {
                    num = 0;
                    this.tool.removeTrans(oUl);
                    this.tool.translate(oUl, "translateY(" + (-iH * num) + "px)");
                }
            }.bind(this));
        }.bind(this), 2000);
    },
    // touch_solid: function () {
    //     var oUl = document.querySelector('.killCont>ul');
    //     var oLi=oUl.children[0].offsetWidth;
    //     var startX = 0;
    //     //滑动后的位置
    //     var moveX = 0;
    //     //滑动距离
    //     var disX = 0;
    //     // 是否滑动
    //     var isMove = false;
    //     oUl.addEventListener('touchstart', function (e) {
    //         startX = e.touches[0].clientX;
    //     });
    //     oUl.addEventListener('touchmove', function (e) {
    //         isMove = true;
    //         moveX = e.touches[0].clientX;
    //         disX = moveX - startX;
    //         this.tool.removeTrans(oUl)
    //         this.tool.translate(oUl, 'translateX(' + (-oLi+disX) + 'px)');
    //     }.bind(this));
      
    // }
}