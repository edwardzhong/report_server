    //字段描述
    var _dataDesc = {
        'time_stamp': '统计时间'
    };
    //是否显示的字段
    var _fields = {};
    //数据
    var _data = [];

    /**
     * 模版映射方法
     */
    template.helper('desc', function(prop) {
        return _dataDesc[prop] || '';
    });
    template.helper('field', function(prop) {
        return _fields[prop] || '';
    });
    template.helper('dateFormat', function(d) {
        var temp = formatDateTime(new Date(d * 1000));
        // return temp.date.join('-')+' '+temp.time.join(':');
        return temp.date.join('-');
    });

    /**
     * 绑定事件
     */
    function bindEvent() {
        $('.datepicker').datepicker({
            format: 'yyyy-mm-dd'
        });
        $('#search').on('click', search);
        $('#chart').on('click', showChart);
    }

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
            endTime = $('#endTime').val();
        $('#fields').empty();
        $('#tbWrap').empty();
        getData(startTime, endTime).done(function(data) {
            if (data.isSucc) {
                //更新字段描述
                data.fields.forEach(function(item,i){
                    _dataDesc['hit_times_'+item.rid]=item.rid_name+'命中次数';
                    _dataDesc['hit_users_'+item.rid]=item.rid_name+'命中用户数';
                });
                _fields = {};
                _data = data.data;
                _data.forEach(function(item, i) {
                    var index =0;
                    for (var v in item) {
                        if (v == 'time_stamp') {
                            continue;
                        }
                        if (v in _dataDesc) {
                            _fields[v] = index>3?false:true;
                            index++;
                            continue;
                        }
                        // if(v.search('hit_times_')>-1||v.search('hit_users_')>-1){
                        //   _fields[v]=true;
                        //   continue;
                        // }
                        delete item[v];
                    }
                });
                var $box = $('#chartBox');
                if ($box.length && $box.css('display') == 'block') {
                    showChart();
                }
                $('#fields').html(template('fieldTpl', {item: _fields }));
                $('#tbWrap').html(template('tbTpl', {list: _data, fields: _fields }));
                setCheckBoxStyle();
            }
        });
    }

    /**
     * 展示图表
     */
    function showChart() {
        insertBox($('.content'), 'chartBox', '图表');
        renderChart({
            contanier: $('[data-tag=container]'),
            data: _data,
            dataDesc: _dataDesc,
            x: 'time_stamp',
            title: '染色规则统计',
            subtitle: '按序列统计'
        });
    }

    /**
     * 获取数据
     */
    function getData(startTime, endTime) {
        return $.Deferred(function(deferred) {
            $.ajax({
                type: 'get',
                url: '/repsys/getStatisData',
                data: {
                    startTime: startTime,
                    endTime: endTime
                },
                dataType: 'json',
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(err) {
                    deferred.resolve({isSucc: false, msg: err, data: [] });
                }
            });
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
        // $cbs.iCheck('check');
        $cbs.each(function(i,item){
            if(i>3){return false;}
            $(item).iCheck('check');
        });
        //选择字段是否显示
        $cbs.on('ifChanged', function(event) {
            var id = this.id;
            if (id == 'fieldAll') {
                $cbs.iCheck(this.checked ? 'check' : 'uncheck');
            }
            $cbs.each(function(i, item) {
                _fields[item.id] = item.checked;
            });
            $('#tbWrap').html(template('tbTpl', {list: _data, fields: _fields }));
        });
    }

    function init() {
        setParam();
        search();
        bindEvent();
    }

    init();
