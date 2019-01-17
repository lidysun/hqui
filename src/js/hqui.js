/***************************************
 * name: jquery prototype extends
 * tips: jquery 原型方法扩展
 ****************************************/
$(function() {
    //placeholder兼容
    $.fn.placeholder = function() {
        if (!("placeholder" in document.createElement("input"))) {
            return $(this).each(function(n, item) {
                var $me = $(item),
                    placeholder = $me.attr("placeholder");
                $me.val(placeholder);
                $me.bind("focus", function() {
                        $me.val() == placeholder && $me.val("");
                    })
                    .bind("blur", function() {
                        !$me.val() && $me.val(placeholder);
                    });
            });
        }
    };
    $('[placeholder]').placeholder();

    //下拉框
    $.fn.dropdown = function(event, callback) {
        if (arguments.length < 1) {
            event = 'click';
        }
        if (event instanceof Function) {
            callback = event;
            event = 'click';
        }
        return $(this).each(function() {
            var $drop = $(this),
                $val = $drop.find('.dropdown-value'),
                $options = $drop.find('.dropdown-options'),
                isActived = $drop.hasClass('active'),
                isDisabled = $drop.hasClass('disabled') || $drop.attr('disabled');
            if (!isDisabled && !isActived) {
                $drop.on(event, function(e) {
                    $drop.addClass('active');
                }).on("mouseleave", function() {
                    $drop.removeClass('active');
                }).on("click", "dd", function() {
                    var $item = $(this),
                        selectedVal = $item.attr('data-value');
                    $val.text($item.text()).attr('data-value', selectedVal);
                    $drop.trigger('mouseleave');
                    //回调参数：选中的val值 该元素
                    callback && callback(selectedVal, $drop);
                });
            }

        });
    };
    $('.dropdown').dropdown('mouseenter');
    //单选框
    $.fn.radio = function(callback) {
        return $(this).each(function() {
            var $me = $(this),
                $group = $me.closest('.radio-group'),
                key = $me.find('span').attr('data-value'),
                isDisabled = $me.hasClass('radio-disabled'),
                $siblings = $me.siblings('.radio'),
                $input = $me.siblings('.radio-input');
            !isDisabled && $me.on('click', function() {
                $me.addClass('radio-active').find('.iconfont').html('&#xe655;');
                $siblings.removeClass('radio-active').find('.iconfont').html('&#xe6c9;');
                $input.val(key);
                callback && callback(key, $group);
            });
        });
    };
    $('.radio').radio(function(key, $group) {
        console.log('选择了：', key, $group);
    });
    //复选框
    $.fn.checkbox = function(callback) {
        return $(this).each(function() {
            var $group = $(this),
                $checkbox = $group.find('.checkbox'),
                $input = $group.find('.checkbox-input'),
                $active = $group.find('.checkbox-active'),
                valueArr = [];
            if ($active.length) {
                $active.each(function() {
                    var $this = $(this);
                    valueArr.push($this.find('span').attr('data-value'));
                });
            }
            $checkbox.each(function() {
                var $me = $(this),
                    key = $me.find('span').attr('data-value'),
                    isDisabled = $me.hasClass('checkbox-disabled'),
                    $siblings = $me.siblings('.checkbox');
                if (!isDisabled) {
                    $me.on('click', function() {
                        var isActived = $me.hasClass('checkbox-active');
                        if (!isActived) {
                            $me.addClass('checkbox-active').find('.iconfont').html('&#xe612;');
                            valueArr.push(key);
                        } else {
                            $me.removeClass('checkbox-active').find('.iconfont').html('&#xe60f;');
                            valueArr.remove(key);
                        }
                        $input.attr('value', valueArr.join(','));
                        callback && callback(valueArr, $group);
                    });
                }
            });
        });
    };
    $('.checkbox-group').checkbox(function(valArr, $group) {
        console.log('选择了：', valArr, $group);
    });
    //开关按钮(ps坑：变量不能以'switch'命名 否则IE报错)
    $.fn.switchItem = function(callback) {
        return $(this).each(function() {
            var $me = $(this),
                isDisabled = $me.hasClass('disabled'),
                $text = $me.find('span'),
                textArr = $text.attr('data-text').split('/'),
                textON = textArr[0],
                textOFF = textArr[1],
                $icon = $me.find('i');
            $text.text($me.hasClass('switch-active') ? textOFF : textON);
            if (!isDisabled) {
                $me.on('click', function() {
                    var isActived = $me.hasClass('switch-active');
                    $text.text(isActived ? textON : textOFF);
                    $me.toggleClass('switch-active');
                });
            }
        });
    };
    $('.switch').switchItem();
    //pagination分页器
    $.fn.pagination = function(opt) {
        return $(this).each(function() {
            var $page = $(this);
            var index = Math.abs(parseInt($(this).attr('data-index'))); //总数据数量：每页数量*页数
            var num = parseInt($(this).attr('data-num')); //总数据数量：每页数量*页数
            var defaults = {
                index: index || 1, //默认页码，当前页码
                counts: 20, //每页显示多少条数据
                pre: '上一页',
                next: '下一页',
                maxPageBtns: 9, // 最多显示的页码按钮数，1...7 8 9 10 11 12 13...100,须为2*n+3
                num: num
            };
            var option = $.extend({}, defaults, opt);
            var pages = Math.ceil(option.num / option.counts);
            //点击跳转
            $page.on('click', '.page-item:not(.disabled)', function() {
                var $btn = $(this);
                var preIndex = parseInt($page.find('.active').text());
                if ($btn.hasClass('prev')) {
                    option.index = preIndex - 1;
                    option.index = option.index < 1 ? 1 : option.index;
                } else if ($btn.hasClass('next')) {
                    option.index = preIndex + 1;
                    option.index = option.index > pages ? pages : option.index;
                } else {
                    option.index = parseInt($btn.text());
                }
                $page.html('');
                createPage(option.index);
            });
            //超过最大页
            if (option.index > pages) {
                option.index = pages;
                $page.attr('data-index', pages);
            }
            createPage(option.index);

            function createPage(indexPage) {
                var html = '';
                var firstPage = '<a class="page-item page1">1</a>';
                var LastPage = '<a class="page-item page' + pages + '">' + pages + '</a>';
                var dot = '<span class="dot">...</span>';
                var flag = '<a class="prev page-item">' + option.pre + '</a>';
                var index = indexPage || option.index;
                if (pages > option.maxPageBtns) {
                    //大于最多显示的页码按钮数
                    var borderL = (option.maxPageBtns - 3) / 2 + 2; //5
                    var borderR = pages - (option.maxPageBtns - 3) / 2 - 1; //96
                    if (index <= borderL) {
                        for (var a = 1; a <= index + 3; a++) {
                            flag += '<a class="page-item page' + a + '">' + a + '</a>';
                        }
                        flag += dot;
                        flag += LastPage;
                    }
                    if (index > borderL && index < borderR) {
                        flag += firstPage;
                        flag += dot;
                        for (var b = index - 3; b <= index + 3; b++) {
                            flag += '<a class="page-item page' + b + '">' + b + '</a>';
                        }
                        flag += dot;
                        flag += LastPage;
                    }
                    if (index >= borderR) {
                        flag += firstPage;
                        flag += dot;
                        for (var c = index - 3; c < pages; c++) {
                            flag += '<a class="page-item page' + c + '">' + c + '</a>';
                        }
                        flag += LastPage;
                    }

                } else {
                    //小于等于最多显示的页码按钮数
                    for (var i = 1; i <= pages; i++) {
                        flag += '<a class="page-item page' + i + '">' + i + '</a>';
                    }
                }
                flag += '<a class="next page-item">' + option.next + '</a>';
                html += flag;
                $page.append($(html));
                $page.find('.page' + index).addClass('active');
                //首尾页
                if ($page.find('.page1').hasClass('active')) {
                    $page.find('.prev').addClass('disabled');
                } else {
                    $page.find('.prev').removeClass('disabled');
                }
                if ($page.find('.page' + pages).hasClass('active')) {
                    $page.find('.next').addClass('disabled');
                } else {
                    $page.find('.next').removeClass('disabled');
                }
            }
        });
    };
    $('.pagination').pagination();
    //number数量加减输入框
    $.fn.number = function(callback) {
        return this.each(function() {
            var $ele = $(this),
                $number = $ele.find(".num"),
                $minus = $ele.find(".minus"),
                $plus = $ele.find(".plus"),
                $tip = $ele.find('.tips'),
                priceArr = $ele.attr('data-price') ? $.parseJSON($ele.attr('data-price')) : 0,
                min = $ele.attr("data-min") - 0 || 1,
                max = $ele.attr("data-max") - 0,
                step = $ele.attr("data-step") - 0 || 1;
            $number.on('change', function() {
                var $me = $(this),
                    val = $me.val(),
                    isNum = /^\d$/g.test(val),
                    isStepNum = val % step;
                if (!isNum) {
                    $me.val(val.replace(/^0|[^\d]/g, ''));
                    if ($me.val() === '') {
                        $me.val(min);
                        showTips('请输入有效数量值！');
                    }
                }
                val = $me.val() - 0;
                //倍数验证
                if (isStepNum !== 0) {
                    showTips('只能是' + step + '的倍数！');
                    if (val > min) {
                        val > step && $me.val($me.val() - isStepNum);
                        val <= step && $me.val(step);
                    }
                }
                //最小验证
                if (min) {
                    if (val < min) {
                        $minus.addClass('disabled');
                        $me.val(min);
                        showTips('不能小于起订量' + min + '！');
                    } else if (val == min) {
                        $minus.addClass('disabled');
                    } else {
                        $minus.removeClass('disabled');
                    }
                }
                //最大验证
                if (max) {
                    if (val > max) {
                        $plus.addClass('disabled');
                        $me.val(max);
                        showTips('不能大于最大量' + max + '！');
                    } else if (val == max) {
                        $plus.addClass('disabled');
                    } else {
                        $plus.removeClass('disabled');
                    }
                }

                //依据上面规则排除不符合的条件的val值
                val = $me.val() - 0;
                if (priceArr) {
                    var unitPrice = getPrice();
                    var totalPrice = (unitPrice * val).toFixed(2);
                    $ele.attr('data-unitPrice', unitPrice).attr('data-totalPrice', totalPrice);
                    //回调参数：当前ele对象,单价,总价
                    callback && callback($ele, unitPrice, totalPrice);
                } else {
                    //回调参数：当前ele对象
                    callback && callback($ele);
                }
            }).trigger('change'); //初始化
            $ele.on('click', '.minus', function() {
                var $me = $(this);
                var val = $number.val() - 0;
                var disabled = $me.hasClass('disabled');
                if (!disabled) {
                    $number.val(val - step);
                    $number.trigger('change');
                }
            }).on('click', '.plus', function() {
                var $me = $(this);
                var val = $number.val() - 0;
                var disabled = $me.hasClass('disabled');
                if (!disabled) {
                    $number.val(val + step);
                    $number.trigger('change');
                }
            });
            //获取区间单价
            function getPrice() {
                var unitPrice = null,
                    length = priceArr.length,
                    i = length - 1;
                for (; i >= 0; i--) {
                    var num = parseInt(priceArr[i].num);
                    if ($number.val() >= num) {
                        unitPrice = priceArr[i].price.replace(/[\￥\$]/, '');
                        break;
                    }
                }
                return unitPrice ? parseFloat(unitPrice) : null;
            }
            //错误提示
            function showTips(text) {
                $tip.text(text).show();
                clearTimeout(t);
                var t = setTimeout(function() {
                    $tip.hide();
                }, 1500);
            }
        });
    };
    $(".number-item").number(function($el, unitPrice, totalPrice) {
        $('#j_unitPrice').text(unitPrice);
        $('#j_totalPrice').text(totalPrice);
    });
    //跑马灯
    $.fn.marquee = function(option) {
        return $(this).each(function() {
            var $me = $(this); //marquee-container
            var defaults = {
                speed: 20, //滚动每个元素所耗毫秒时间，即速度,值越小越快
                direction: 'top', //滚动方向bottom|top|left|right
                visible: 1, //容器可见数量
                height: null //容器像素高度
            };
            var opt = $.extend({}, defaults, option);
            var $wrap = $me.children('.marquee-list'); //ul容器
            var wrapHeight = null; //ul高度
            var wrapWidth = null; //ul宽度
            var $item = $wrap.find('.marquee-item'); //每个滚动元素
            var itemHeight = $item.first().outerHeight(true); //单个滚动元素高
            var itemWidth = $item.first().outerWidth(true); //单个滚动元素宽
            var cssRelative = {
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden'
            };
            $me.css(cssRelative);
            $wrap.css(cssRelative);
            var isHorizontal = opt.direction === 'left' || opt.direction === 'right';
            var isVertical = opt.direction === 'bottom' || opt.direction === 'top';
            var isReverse = opt.direction === 'bottom' || opt.direction === 'right';
            //复制一份插入首尾
            var $copy = $wrap.children().clone().addClass('marquee-item-copy');
            isReverse ? $wrap.prepend($copy) : $wrap.append($copy);
            if (isHorizontal) {
                // 水平容器高宽度样式设置
                var $itemsAll = $wrap.find('.marquee-item');
                var $clear = $('<div style="clear:both;height:0;visibility:hidden;"></div>');
                $me.css({
                    width: itemWidth * opt.visible
                });
                $wrap.append($clear).css({
                    width: itemWidth * $itemsAll.length
                });
                $itemsAll.css({
                    float: 'left'
                });
                wrapWidth = $wrap.outerWidth(true) / 2; //水平方向时宽度需要除去复制的
                wrapHeight = $wrap.outerHeight(true);
            } else {
                // 垂直容器高宽度样式设置
                $me.css('height', itemHeight * opt.visible);
                wrapHeight = $wrap.outerHeight(true) / 2; //垂直方向时高度需要除去复制的
                wrapWidth = $wrap.outerWidth(true);
            }
            //自定义容器高读
            opt.height && $me.css('height', opt.height);
            //整体偏移$item.length个元素高或宽度(bottom|right)
            if (opt.direction === 'bottom') {
                $wrap.css('marginTop', -wrapHeight);
            }
            if (opt.direction === 'right') {
                $wrap.css('marginLeft', -wrapWidth);
            }
            var cssObj = {};
            var cssStyle = isVertical ? 'top' : 'left';
            var cssValue = isReverse ? '+=1' : '-=1';
            cssObj[cssStyle] = cssValue;
            //滚动函数
            var loop = function() {
                $wrap.animate(cssObj, opt.speed, 'linear', function() {
                    var moveValue = Math.abs(parseInt($wrap.css(cssStyle)));
                    if (moveValue > (isVertical ? wrapHeight : wrapWidth)) {
                        $wrap.css(cssStyle, 0);
                    }
                });
            };
            clearInterval(t);
            var t = window.setInterval(loop, 1);
            $me.hover(function() {
                $wrap.stop(true, false);
                clearInterval(t);
            }, function() {
                t = setInterval(loop, opt.speed);
            });
        });
    };
    $('.marquee1').marquee({
        direction: 'top'
    });
    $('.marquee2').marquee({
        direction: 'bottom',
        visible: 2
    });
    $('.marquee3').marquee({
        direction: 'left'
    });
    $('.marquee4').marquee({
        direction: 'right'
    });
    //无缝轮播
    $.fn.slider = function(option) {
        return $(this).each(function() {
            var $me = $(this);
            var defaults = {
                wrap: '.slider-list',
                item: '.slider-item',
                autoplay: true,
                speed: 800,
                delay: 2000,
                arrow: false,
                nav: false
            };
            var opt = $.extend({}, defaults, option);
            opt.delay = opt.delay <= opt.speed ? opt.speed + 100 : opt.delay;
            var $wrap = $me.find(opt.wrap);
            var $item = $wrap.children(opt.item);
            var $first = $item.first();
            var $last = $item.last();
            var itemLength = $item.length;
            var itemWidth = $first.outerWidth(true);
            var itemHeight = $first.outerHeight(true);
            var t = null;
            var index = 0;
            $me.css({
                width: itemWidth,
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden'
            });
            $wrap.css({
                width: (itemLength + 2) * itemWidth, //下面复制多2个
                height: itemHeight,
                position: 'relative'
            });
            //$item顺序类名添加
            $item.each(function() {
                var itemIndex = $(this).index();
                $(this).addClass('slider-item-' + itemIndex);
                $(this).attr('data-index', itemIndex);
            });
            //复制首尾,如原图有 1-2-3-4,则变为4-1-2-3-4-1
            $wrap.append($first.clone().addClass('slider-item-copy'));
            $wrap.prepend($last.clone().addClass('slider-item-copy'));
            //偏移一个$item宽度才能初始化显示第一个
            $wrap.css('left', -itemWidth);
            //导航点
            if (opt.nav) {
                var navHtml = '<span class="slider-nav">';
                for (var j = 0; j < itemLength; j++) {
                    navHtml += '<i class="nav nav' + j + '" data-index="' + j + '"></i>';
                }
                navHtml += '</span>';
                $me.append(navHtml);
                $me.find('.nav').first().addClass('active');
            }
            var $nav = $me.find('.nav');
            //左右箭头
            if (opt.arrow) {
                var arrowHtml = '<span class="arrow prev">&lt;</span><span class="arrow next">&gt;</span>';
                $me.append(arrowHtml);
            }

            function move() {
                //当ul正在执行动画的过程中，阻止执行其它动作。关键之处，不然图片切换显示不完全，到最后图片空白不显示。
                if ($wrap.is(':animated')) {
                    return false;
                }
                $wrap.animate({
                    marginLeft: -index * itemWidth + 'px'
                }, opt.speed, function() {
                    $nav.removeClass('active').eq(index).addClass('active');
                    if (index >= itemLength) {
                        index = 0;
                        $nav.first().addClass('active');
                        $(this).css('marginLeft', 0);
                    } else if (index < 0) {
                        index = itemLength - 1;
                        $(this).css('marginLeft', -(itemLength - 1) * itemWidth);
                    }
                });
            }

            function play() {
                clearInterval(t);
                t = setInterval(function() {
                    index++;
                    move(index);
                }, opt.delay);
            }
            if (opt.autoplay) {
                play();
            }
            $me.hover(function() {
                clearInterval(t);
            }, function() {
                if (opt.autoplay) {
                    play();
                }
            });
            $me.on('click', '.nav', function(argument) {
                clearInterval(t);
                index = parseInt($(this).attr('data-index'));
                move();
            });
            $me.on('click', '.arrow', function(argument) {
                clearInterval(t);
                if ($(this).hasClass('prev')) {
                    index -= 1;
                } else {
                    index += 1;
                }
                move();
            });
        });
    };
    $('.slider-container').slider({
        // autoplay: false,
        delay: 2000,
        nav: true,
        arrow: true
    });
    //tab切换
    $.fn.tab = function(callback) {
        return $(this).each(function() {
            var $me = $(this),
                $btns = $me.find('.tab-title'),
                $item = $me.find('.tab-item');
            $me.on('click', '.tab-title', function(e) {
                var $btn = $(this),
                    index = $btn.index();
                $btns.removeClass('active');
                $btn.addClass('active');
                $item.removeClass('active').eq(index).addClass('active');
                callback && callback(index); //参数index为当前激活索引 
                e.preventDefault();
            });
        });
    };
    $('.tab').tab();
    //进度条 value设定百分比字符串,如'36.6%';showValue是否显示进度百分比值
    $.fn.progress = function(percent, showValue) {
        return $(this).each(function() {
            var $me = $(this),
                val = percent || parseFloat($me.attr('data-value')) + '%';
            $bar = $me.find('.progress-bar');
            $bar.css('width', val);
            if (showValue) {
                $('<span class="progress-txt">' + val + '</span>').appendTo($bar);
            }
        });
    };
    $('.progress').progress(false, true);
    //手风琴
    $.fn.collapse = function(event) {
        return $(this).each(function() {
            var $me = $(this),
                $hds = $me.find('.collapse-hd'),
                $items = $me.find('.collapse-item');
            $me.find('.active .collapse-bd').show();
            $hds.on(event, function(e) {
                var $item = $(this).parent('.collapse-item'),
                    isActived = $item.hasClass('active');
                if (!isActived) {
                    $items.removeClass('active').find('.collapse-bd').stop().slideUp();
                    $item.addClass('active').find('.collapse-bd').stop().slideDown();
                }
            });
        });
    };
    $('.collapse').collapse('click');
});

/***************************************
 * name: common function tool
 * tips: 通用方法工具
 ****************************************/
//字符串删除前后空格
String.prototype.trim = function() {
    return this.replace(/(^\s+)|(\s+$)/g, '');
};
//数组值索引
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            return i;
        }
    }
    return -1;
};
//数租删除值
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index != -1) {
        this.splice(index, 1);
        this.remove(val); //继续删除重复的val
    }
    return this;
};
//数组去重
Array.prototype.uniq = function() {
    this.sort();
    var temp = [this[0]];
    for (var i = 1; i < this.length; i++) {
        if (this[i] !== temp[temp.length - 1]) {
            temp.push(this[i]);
        }
    }
    return temp;
};
// 数值数组最大值
Array.prototype.max = function() {
    return Math.max.apply(null, this);
};
// 数值数组最小值
Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

//11位手机号格式化
function telFormat(tel, space) {
    space = space ? space : ' ';
    return String(tel).replace(/(\d{3})(\d{4})(\d{3})/, '$1' + space + '$2' + space + '$3');
}
//获取路径文件信息(文件名、后缀名)
/*var path = "C:\\Users\\sungang\\Desktop\\temp\\email\\index.html";
var href = window.location.href;
var url = 'https://www.example.com/search/LM358.html?type=1&num=1';*/
function getFileInfo(filePath, key) {
    filePath = filePath.split('?')[0]; //去参数
    var re = /([^\.\/\\]+)\.([a-z]+)$/i,
        resultArr = re.exec(filePath),
        info = {};
    if (resultArr) {
        info.name = resultArr[1];
        info.type = resultArr[2];
    }
    return key ? info[key] : info;
}

//获取链接字符串参数
function getParams(path) {
    var obj = {};
    path = path ? path : window.location.href;
    //[^\?&=]+ 表示不含?或&或=的连续字符，加上()就是提取对应字符串
    path.replace(/([^\?&=]+)=([^\?&=]*)/gi, function(rs, $1, $2, offset, source) {
        obj[$1] = $2;
    });
    return obj;
}

/*测试函数*/
function test() {
    return true;
}