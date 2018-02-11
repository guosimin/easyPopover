/**
 *
 *
 * Author:   gsm(qq:2479186745)
 * History:
 * Date         Version Remarks
 * ============ ======= ======================================================
 * 2017/12/27      1.0     First version
 *
 * Copyright 2016, all rights reserved. Essa.cn
 * */

(function () {
    /**
     * 展示泡泡
     * @param $event
     * @private
     */
    function __showPopover($event,defalutOption) {
        var $triggerDom = $($event.currentTarget);
        var idName = $triggerDom.attr("popover-num");
        var tpl = '';
        if($("#"+idName).length<1){
            if(defalutOption.hasArrow){
                var arrowIcon = 't';
                switch (defalutOption.placement){
                    case 'top':
                        arrowIcon = 'd';
                        break;
                    case 'left':
                        arrowIcon = 'r';
                        break;
                    case 'right':
                        arrowIcon = 'l';
                        break;
                    case 'bottom':
                        arrowIcon = 't';
                        break;
                }
                tpl = '<span class="popover-box '+(defalutOption.popoverClass)+'" id="'+idName+'">' +
                    '<div>' +
                    '<span class="popover-arrow-icon icon-img icon-arrow-blue-'+arrowIcon+'"></span>' +
                    '<div class="arrow-popover-content">'+defalutOption.content+'</div>' +
                    '</div>' +
                    '</span>';



            }else{
                tpl = '<span class="popover-box '+(defalutOption.popoverClass)+'" id="'+idName+'">'+defalutOption.content+'</span>';
            }
            $("body").append(tpl);
        }

        //修改泡泡位置
        __changePopoverPosition($triggerDom);

        //修改箭头位置
        __changeArrowPosition($triggerDom);

        //用于处理宽度不确定的泡泡
        /*setTimeout(function () {
            __changeAllPopoverPosition();
        },0);*/
    }

    /**
     * 关闭泡泡
     * @param $event
     * @private
     */
    function __closePopover($event) {
        var idName = $($event.currentTarget).attr("popover-num");
        $("#"+idName).remove();
    }

    /**
     * 监听关闭按钮
     * @param idName 需要关闭的泡泡名称
     * @param defalutOption 组件参数
     * @private
     */
    function __listenClose(idName,defalutOption) {
        $(document).on("click.popover-close","#"+idName+" .popover-close",function () {
            $("#"+idName+"").remove();
            if(typeof defalutOption.closeFn == 'function'){
                defalutOption.closeFn();
            }
        });
    }

    /**
     * 获取初始箭头位置
     * @private
     */
    function __getInitArrowCss($currTarget,defalutOption) {
        var initCss = {
            position: 'absolute'
        }
        var idName = $currTarget.attr("popover-num");
        if(defalutOption.reference){
            $currTarget = $currTarget.find(defalutOption.reference);
        }
        var comparW = $("#"+idName)[0].offsetWidth<=$currTarget[0].offsetWidth;
        var comparH = $("#"+idName)[0].offsetHeight<=$currTarget[0].offsetHeight;
        switch (defalutOption.placement){
            case 'top':
                initCss = $.extend(true,initCss,{
                    bottom:'-10px',
                    left:(defalutOption.deviation===''||comparW)?'50%':($currTarget[0].offsetWidth)/2,
                    'margin-left':'-10px'
                });
                break;
            case 'left':
                initCss = $.extend(true,initCss,{
                    right:'-10px',
                    top:(defalutOption.deviation===''||comparH)?'50%':($currTarget[0].offsetHeight)/2,
                    'margin-top':'-10px'
                });
                break;
            case 'right':
                initCss = $.extend(true,initCss,{
                    left:'-10px',
                    top:(defalutOption.deviation===''||comparH)?'50%':($currTarget[0].offsetHeight)/2,
                    'margin-top':'-10px'
                });
                break;
            case 'bottom':
                initCss = $.extend(true,initCss,{
                    top:'-10px',
                    left:(defalutOption.deviation===''||comparW)?'50%':($currTarget[0].offsetWidth)/2,
                    'margin-left':'-10px'
                });
                break;
        }
        return initCss;
    }

    /**
     * 修改箭头位置
     * @param $triggerDom 触发dom
     * @private
     */
    function __changeArrowPosition($triggerDom) {
        var idName = $triggerDom.attr("popover-num");
        if($("#"+idName).find(".popover-arrow-icon").length>0){
            var defalutOption = JSON.parse($triggerDom.attr('popover-option'));
            var initArrowStyle = __getInitArrowCss($triggerDom,defalutOption);
            var arrowStyle = $.extend(true,initArrowStyle,defalutOption.arrowStyle);
            $("#"+idName).find(".popover-arrow-icon").css(arrowStyle);
        }
    }

    /**
     * 修改泡泡位置
     * @param $triggerDom
     * @private
     */
    function __changePopoverPosition($triggerDom) {
        var idName = $triggerDom.attr("popover-num");
        var defalutOption = JSON.parse($triggerDom.attr('popover-option'));
        var objOffset = defalutOption.reference?$triggerDom.find(defalutOption.reference).offset():$triggerDom.offset();;
        var position = __getPosition($triggerDom);
        var popoverStyle = $.extend(true,{
            position:'fixed',
            top:objOffset.top-$(document).scrollTop()+(position.top),
            left:objOffset.left-$(document).scrollLeft()+(position.left),
        },defalutOption.popoverStyle);

        $("#"+idName).css(popoverStyle);

        // 如果宽度不确定
        if(defalutOption.autoWidth!=='true'){
            setTimeout(function () {
                if(parseInt($("#"+idName).css("max-width"))==parseInt($(window).width()-(objOffset.left-$(document).scrollLeft()+(position.left)))){
                    return false;
                }
                $("#"+idName).css("max-width",$(window).width()-(objOffset.left-$(document).scrollLeft()+(position.left)));
                __changePopoverPosition($triggerDom);
            })
        }
    }

    /**
     * 修改泡泡位置
     * @param $triggerDom 触发展示泡泡的dom的jq实例
     * @param $popoverDom 泡泡的dom的jq实例
     * @param placement 泡泡位置 （top,bottom,left,right,）
     * @param hasArrow  是否有箭头 （true,false）
     * @returns {{}}
     * @private
     */
    function __getPosition($triggerDom) {
        var idName = $triggerDom.attr("popover-num");
        var $popoverDom = $("#"+idName);

        var defalutOption = JSON.parse($triggerDom.attr('popover-option'));
        var $triggerDom = defalutOption.reference?$triggerDom.find(defalutOption.reference):$triggerDom;
        //是否有箭头
        var hasArrow = defalutOption.hasArrow;
        var children = (hasArrow==='true'||hasArrow===true)?($($popoverDom).find(".arrow-popover-content").children()):($popoverDom.children());
        var $popoverDom = (hasArrow==='true'||hasArrow===true)?($($popoverDom).find(".arrow-popover-content")):$popoverDom;

        var deviation =  defalutOption.deviation;

        //获取触发dom和泡泡的宽高
        var triggerDomHeight = $triggerDom[0].offsetHeight;
        var popoverDomHeight = (children.length>0)?children[0].offsetHeight:$popoverDom[0].offsetHeight;
        var triggerDomWidth = $triggerDom[0].offsetWidth;
        var popoverDomWidth = (children.length>0)?children[0].offsetWidth:$popoverDom[0].offsetWidth;

        //泡泡最终偏移位置
        var offset = {};


        //箭头占位
        var arrowSize = (hasArrow==='true'||hasArrow==true)?11:0;

        //是否设置了偏移值,有则已偏移值为准,否则居中到触发元素
        switch (defalutOption.placement){
            case 'bottom':
                offset = {
                    top:triggerDomHeight+arrowSize,
                    left:deviation!==''?deviation:((triggerDomWidth/2)-(popoverDomWidth/2))
                };
                break;
            case 'top':
                offset = {
                    top:-popoverDomHeight-arrowSize,
                    left:deviation!==''?deviation:((triggerDomWidth/2)-(popoverDomWidth/2))
                };
                break;
            case 'left':
                offset = {
                    top:deviation!==''?deviation:((triggerDomHeight/2)-(popoverDomHeight/2)),
                    left:-popoverDomWidth-arrowSize
                };
                break;
            case 'right':
                offset = {
                    top:deviation!==''?deviation:((triggerDomHeight/2)-(popoverDomHeight/2)),
                    left:triggerDomWidth+arrowSize
                };
                break;
        }
        return {
            top:parseInt(offset.top),
            left:parseInt(offset.left)
        };
    }

    /**
     * 调整已经展示的泡泡位置
     * @private
     */
    function __changeAllPopoverPosition() {
        $("[popover-num]").each(function () {
            var $triggerDom = $(this);
            var idName = $(this).attr("popover-num");
            if($("#"+idName).length>0){
                //修改泡泡位置
                __changePopoverPosition($triggerDom);

                //修改箭头位置
                __changeArrowPosition($triggerDom);
            }
        });
    }

    $.fn.extend({
        easyPopover:function (option) {
            //默认参数
            var defalutOption = $.extend(true,{
                trigger:'click',      //触发方法
                placement:'bottom',  //弹出位置
                popoverClass:'',    //泡泡class
                popoverStyle:{},    //泡跑style
                content:'泡泡内容', //泡泡内容
                hasArrow:false,  //是否有箭头
                arrowStyle:{},    //箭头样式
                reference:'',      //泡泡的展示基准
                deviation:'',       //泡泡偏移值
                autoWidth:'true'        //宽度自定义
            },option);

            //定义唯一id并把关键信息记录在触发泡泡的dom中
            var num = parseInt(100000*Math.random());
            while ($('[popover-num="popover'+num+'"]').length>0){
                num = parseInt(100000*Math.random());
            }
            $(this).attr({
                "popover-num":('popover'+num),
                'popover-option':JSON.stringify(defalutOption)
            });

            //记录触发泡泡的选择器
            var selector = "[popover-num="+('popover'+num)+"]";
            //记录泡泡的id名
            var idName = $(selector).attr('popover-num');

            //判断触发方式
            switch (defalutOption.trigger){
                case 'hover':
                    $(document).on('mouseover',selector,function ($event) {
                        //展示泡泡
                        __showPopover($event,defalutOption);
                    });
                    $(document).on('mouseout',selector,function ($event) {
                        //隐藏泡泡
                        __closePopover($event);
                    });
                    break;
                case 'click':
                    $(document).on("click",selector,function ($event) {
                        //展示泡泡
                        __showPopover($event,defalutOption);
                    });

                    $(document).click(function($event){
                        var target = $($event.target);
                        //如果点击 非 触发泡泡按钮以及泡泡则隐藏泡泡
                        if(target.closest(selector).length != 0||target.closest("#"+idName).length != 0){
                            return
                        };
                        $("#"+idName).remove();
                    });

                    //滚动页面改变位置
                    $(document).scroll(function () {
                        __changeAllPopoverPosition();
                    });

                    //缩放页面改变位置
                    $(window).resize(function () {
                        __changeAllPopoverPosition();
                    });
                    break;
            }

            /**
             * 监听关闭事件
             */
            __listenClose(idName,defalutOption);

            //返回泡泡实例
            return $("#popover"+num);
        }
    });
})();