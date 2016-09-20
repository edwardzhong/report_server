
    Highcharts.theme = {
      colors: ["#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
      chart: {
        backgroundColor: null,
        style: {
          fontFamily: "Dosis, sans-serif"
        }
      },
      title: {
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }
      },
      tooltip: {
        borderWidth: 0,
        backgroundColor: 'rgba(219,219,216,0.8)',
        shadow: false
      },
      legend: {
        itemStyle: {
          fontWeight: 'bold',
          fontSize: '13px'
        }
      },
      xAxis: {
        gridLineWidth: 1,
        labels: {
          style: {
            fontSize: '13px'
          }
        }
      },
      yAxis: {
        minorTickInterval: 'auto',
        title: {
          style: {
            textTransform: 'uppercase'
          }
        },
        labels: {
          style: {
            fontSize: '13px'
          }
        }
      },
      plotOptions: {
        candlestick: {
          lineColor: '#404048'
        }
      },
      // General
      background2: '#F0F0EA'
    };
    Highcharts.setOptions(Highcharts.theme);

    function renderChart(opt){
      var xAxisCat=[],series=[],seriesObj={};
      opt.data.forEach(function(item,i){
        xAxisCat.push(item[opt.x]);
        for(var v in item){
          seriesObj[v]=seriesObj[v]||[];
          seriesObj[v].push(item[v]);
        }
      });

      for(var v in seriesObj){
        if(v==opt.x||v=='scene_id'||v.indexOf('_percent')>-1){continue;}
        series.push({
          name:opt.dataDesc[v],
          data:seriesObj[v] 
        });
      }

      opt.contanier.highcharts({
          chart: {
              type: 'line'
          },
          title: {
              text: opt.title
          },
          subtitle: {
              text: opt.subtitle
          },
          xAxis: {
              categories: xAxisCat
          },
          yAxis: {
              title: {
                  text: '数量'
              }
          },
          plotOptions: {
              line: {
                  dataLabels: {
                      enabled: true
                  },
                  enableMouseTracking: true
              }
          },
          series: series
      });
    };

    /**
     * 格式化日期
     */
    function formatDateTime(d){
      return {
        date:[d.getFullYear(),('0'+(d.getMonth()+1)).slice(-2),('0'+d.getDate()).slice(-2)],
        time:[('0'+d.getHours()).slice(-2),('0'+d.getMinutes()).slice(-2),('0'+d.getSeconds()).slice(-2)]
      };
    }

    /**
     * 插入box框
     */
    function insertBox(elem, id, title) {
        var $box = $('#' + id);
        if ($box.length) {
            $box.show();
            $box.find('.box-body').show();
            return;
        }
        var _html = template('boxTpl', {id: id, title: title });
        elem.append(_html);
    }