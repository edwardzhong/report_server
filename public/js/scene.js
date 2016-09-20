    //字段描述
    var _dataDesc = {
        'dan_time': '时间',
        'scene_id': '场景',
        'dan_check_total': '访问总数',
        'dan_user_total': '访问用户数',
        'dan_check_H_total': '命中高风险总数',
        'dan_user_H_total': '命中高风险用户数',
        'dan_hit_percent': '高风险命中占比',
        'dan_user_percent': '高风险用户占比',
        'bc_percent': '补偿率',
        'dan_hit_all_H': '交叉命中次数',
        'dan_hit_all_H_user': '交叉命中用户数',
        'dan_hit_chendu_H': '命中成都次数',
        'dan_hit_chendu_H_user': '命中成都用户数',
        'dan_hit_me_H': '命中我们次数',
        'dan_hit_me_H_user': '命中我们用户数'
    };

    //是否显示的字段
    var _fields = {};
    //数据
    var _masterData = [];
    var _detailData = [];
    var _scene = {'':'全部','0':'活动', '1':'秒杀', '2':'订单'};

    /**
     * 模版映射方法
     */
    template.helper('desc', function(prop) {
        return _dataDesc[prop] || '';
    });
    template.helper('scene', function(prop) {
        return _scene[prop] || '';
    });
    template.helper('field', function(prop) {
        return _fields[prop] || '';
    });
    template.helper('timeFormat', function(d) {
        d=''+d;
        return [d.slice(0,4),d.slice(4,6),d.slice(6,8)].join('-');
    });

    /**
     * 事件绑定
     */
    function bindEvent() {
        $(window).on('hashchange', function(e) {
            selectHash(location.hash.replace('#', ''));
        });
        $('body').on('click','[data-hash]', function() {
            var hash = $(this).attr('data-hash');
            selectHash(hash);
        });
        $('.datepicker').datepicker({format: 'yyyy-mm-dd'});
        $('#search').on('click', search);
    }

    /**
     * 调用对应的步骤
     */
    function selectHash(hash) {
        var args=[],hashArg='';
        if (location.hash.substr(1) != hash) {
            location.hash = hash;
            return;
        }
        //分解参数
        args=hash.split('|');
        hashArg=args[0];
        if (!hashArg || !(hashArg in _actions)) {
            selectHash('index');
        } else {
            var $box = $('#' + hashArg + 'Panel');
            $box.show().siblings().hide();
            args[0]=$box;
            _actions[hashArg].apply($box,args);
        }
    }

    /**
     * hash对应的步骤
     */
    var _actions = {
        index: function($elem) {
            $elem.find('[data-tag="chart"]').off().on('click', showIndexChart);
        },
        detail: function($elem) {
            $elem.find('[data-tag="chart"]').off().on('click', showDetailChart);
            //如果已经打开则更新
            var $box=$('#detailBox');
            if($box.length&&$box.css('display')=='block'){
                showDetailChart();
            }
        }
        // ,day:function($elem,time){
        //     console.log(time);
        // }
    };

    /**
     * 首次进页面设置查询参数
     */
    function setParam() {
        var start = formatDateTime(new Date(new Date() - 3600 * 1000 * 24 * 6));
        var end = formatDateTime(new Date());
        $('#startTime').val(start.date.join('-'));
        $('#endTime').val(end.date.join('-'));
    }

    /**
     * 查找
     */
    function search() {
        var startTime = $('#startTime').val(),
            endTime = $('#endTime').val(),
            scene = $('#scene').val(),
            temp = [],
            ridObj = {};
        
        $('#tbWrap').empty();
        $('#tbWrap2').empty();
        $('#fields').empty();
        getData(startTime, endTime, scene).done(function(data) {
            if (data.isSucc) {
                //合并规则字段
                _fields = {};
                data.data.forEach(function(item, i) {
                    ridObj['' + item.dan_time] = ridObj['' + item.dan_time] || [];
                    ridObj['' + item.dan_time] = ridObj['' + item.dan_time].concat(item.dan_hit_rid);
                });
                data.sumData.forEach(function(item, i) {
                    if (ridObj['' + item.dan_time]) {
                        ridObj['' + item.dan_time].forEach(function(jtem, j) {
                            temp = jtem.split('&');
                            _fields[temp[0]] = true;
                            item[temp[0]] = item[temp[0]] || 0;
                            item[temp[0]] += parseInt(temp[1], 10);
                        });
                    }
                });
                _masterData = data.data;
                _detailData = data.sumData;
                //更新字段描述
                data.fields.forEach(function(item,i){
                    _dataDesc[''+item.rid]=item.rid_name;
                });
                //清除不需要显示的字段
                _masterData.forEach(function(item, i) {
                    for (var v in item) {
                        if (v in _dataDesc) {continue; }
                        delete item[v];
                    }
                });
                _detailData.forEach(function(item, i) {
                    for (var v in item) {
                        if (v in _dataDesc) {continue; }
                        delete item[v];
                    }
                });
                $('#fields').html(template('fieldTpl', {item: _fields }));
                $('#tbWrap').html(template('masterTbTpl', {list: data.data }));
                $('#tbWrap2').html(template('detailTbTpl', {list: data.sumData,fields: _fields}));
                $('#sceneName').html(_scene[scene]);
                var $iBox=$('#indexBox');
                if($iBox.length&&$iBox.css('display')=='block'){
                    showIndexChart();
                }
                setCheckBoxStyle();
            }
        });
    }

    /**
     * 首页图表
     */
    function showIndexChart(){
        var $elem=$('#indexPanel');
        insertBox($elem.find('[data-tag=content]'), 'indexBox', '图表');
        renderChart({
            contanier: $elem.find('[data-tag=container]'),
            data: _masterData,
            dataDesc: _dataDesc,
            x: 'dan_time',
            title: '数据总计',
            subtitle: '按天统计'
        });
    }

    /**
     * 详细图表
     */
    function showDetailChart(){
        var $elem=$('#detailPanel');
        insertBox($elem.find('[data-tag=content]'), 'detailBox', '图表');
        renderChart({
            contanier: $elem.find('[data-tag=container]'),
            data: _detailData,
            dataDesc: _dataDesc,
            x: 'dan_time',
            title: '命中高风险统计',
            subtitle: '按天统计'
        });
    }
    
    /**
     * 设置iCheck
     */
    function setCheckBoxStyle() {
        var $cbs = $('input[type="checkbox"]');
        $cbs.iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue'
        });
        $cbs.iCheck('check');
        //选择字段是否显示
        $cbs.on('ifChanged', function(event) {
            var id = this.id;
            if (id == 'fieldAll') {
                $cbs.iCheck(this.checked ? 'check' : 'uncheck');
            }
            $cbs.each(function(i, item) {
                _fields[item.id] = item.checked;
            });
            $('#tbWrap2').html(template('detailTbTpl', {list: _detailData,fields: _fields}));
        });
    }

    /**
     * 获取数据
     */
    function getData(startTime, endTime, scene) {
        return $.Deferred(function(deferred) {
            $.ajax({
                type: 'get',
                url: '/repsys/getSceneData',
                data: {
                    startTime: startTime,
                    endTime: endTime,
                    scene: scene
                },
                dataType: 'json',
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(err) {
                    deferred.resolve({isSucc: false, msg: err, data: [], sumData: [] });
                }
            });
        });
    }

    function init() {
        setParam();
        search();
        selectHash(location.hash.substr(1));
        bindEvent();
    }

    init();
