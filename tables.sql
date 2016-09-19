// 风险用户识别与成都对比表
CREATE TABLE `danger_compare_with_chendu` (
  `dan_time` bigint(20) NOT NULL,
  `dan_hit_me` bigint(10) NOT NULL DEFAULT '0' COMMENT '我们命中，成都未命中',
  `dan_hit_chendu` bigint(10) NOT NULL DEFAULT '0' COMMENT '成都命中，我们未命中',
  `dan_hit_all` bigint(10) NOT NULL DEFAULT '0' COMMENT '成都命中，我们命中',
  `dan_hit_chendu_H` bigint(10) NOT NULL DEFAULT '0' COMMENT '成都命中高风险总数',
  `dan_hit_chendu_L` bigint(10) NOT NULL DEFAULT '0' COMMENT '成都命中低风险总数',
  `dan_hit_me_H` bigint(10) NOT NULL DEFAULT '0' COMMENT '我们命中高风险总数',
  `dan_hit_me_L` bigint(10) NOT NULL DEFAULT '0' COMMENT '我们命中低风险总数',
  `dan_hit_all_H` bigint(20) NOT NULL DEFAULT '0' COMMENT '同时命中高',
  `dan_hit_all_L` bigint(20) NOT NULL DEFAULT '0' COMMENT '同时命中低',
  `r1_int` bigint(20) DEFAULT NULL,
  `r1_string` varchar(64) DEFAULT NULL,
  `dan_hit_chendu_H_user` bigint(20) NOT NULL DEFAULT '0' COMMENT '成都命中高风险总数基于wid去重',
  `dan_hit_me_H_user` bigint(20) NOT NULL DEFAULT '0' COMMENT '我们命中高风险总数基于wid去重',
  `dan_hit_all_H_user` bigint(20) NOT NULL DEFAULT '0' COMMENT '交叉命中高风险总数基于wid去重',
  PRIMARY KEY (`dan_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='风险用户识别成都对比'

// 区分场景风险识别统计表
CREATE TABLE `danger_with_scene` (
  `dan_time` bigint(20) NOT NULL,
  `scene_id` bigint(10) NOT NULL DEFAULT '0' COMMENT ' 场景ID 0：促销活动 1：秒杀活动 2：普通下单 3：领券',
  `dan_check_total` bigint(10) NOT NULL DEFAULT '0' COMMENT '访问总请求数',
  `dan_user_total` bigint(10) NOT NULL DEFAULT '0' COMMENT '访问总请求数基于wid去重',
  `dan_check_H_total` bigint(10) NOT NULL DEFAULT '0' COMMENT '命中高危风险总数',
  `dan_user_H_total` bigint(10) NOT NULL DEFAULT '0' COMMENT '命中高危用户总数基于wid去重',
  `dan_check_L_total` bigint(10) NOT NULL DEFAULT '0' COMMENT '命中低危风险总数',
  `dan_user_L_total` bigint(10) NOT NULL DEFAULT '0' COMMENT '命中低危用户总数基于wid去重',
  `dan_hit_rid` varchar(2048) DEFAULT NULL COMMENT '单个规则命中数，格式:rid_数目&rid_数目',
  `dan_hit_rids` varchar(2048) DEFAULT NULL COMMENT '复合规则命中数，格式:复合规则ID_数目&复合规则ID_数目',
  `dan_hit_me` bigint(10) NOT NULL DEFAULT '0' COMMENT '我们命中，成都未命中',
  `dan_hit_chendu` bigint(10) NOT NULL DEFAULT '0' COMMENT '成都命中，我们未命中',
  `dan_hit_all` bigint(10) NOT NULL DEFAULT '0' COMMENT '成都命中，我们命中',
  `dan_hit_chendu_H` bigint(10) NOT NULL DEFAULT '0' COMMENT '成都命中高风险总数',
  `dan_hit_chendu_L` bigint(10) NOT NULL DEFAULT '0' COMMENT '成都命中低风险总数',
  `dan_hit_me_H` bigint(10) NOT NULL DEFAULT '0' COMMENT '我们命中高风险总数',
  `dan_hit_me_L` bigint(10) NOT NULL DEFAULT '0' COMMENT '我们命中低风险总数',
  `dan_hit_all_H` bigint(20) NOT NULL DEFAULT '0' COMMENT '同时命中高',
  `dan_hit_all_L` bigint(20) NOT NULL DEFAULT '0' COMMENT '同时命中低',
  `r1_int` bigint(20) DEFAULT NULL,
  `r1_string` varchar(64) DEFAULT NULL,
  `dan_hit_chendu_H_user` bigint(20) NOT NULL DEFAULT '0' COMMENT '成都命中高风险总数基于wid去重',
  `dan_hit_me_H_user` bigint(20) NOT NULL DEFAULT '0' COMMENT '我们命中高风险总数基于wid去重',
  `dan_hit_all_H_user` bigint(20) NOT NULL DEFAULT '0' COMMENT '交叉命中高风险总数基于wid去重',
  PRIMARY KEY (`dan_time`,`scene_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='风险用户场景识别'

// 规则名称对照表
CREATE TABLE `danger_with_name` (
  `rid` bigint(20) NOT NULL,
  `rid_name` varchar(512) DEFAULT NULL COMMENT '规则名称',
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Rid名字映射'

// 风险打标统计表
CREATE TABLE `t_danger_hit_rid_statis` (
  `seq_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '序列号',
  `statis_type` int(11) NOT NULL DEFAULT '0' COMMENT '统计类型 0为按天  1为按小时',
  `risk_id` int(11) NOT NULL DEFAULT '0' COMMENT '风险标识',
  `create_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '统计时间点 按天或按小时为粒度',
  `hit_times` bigint(20) NOT NULL DEFAULT '0' COMMENT '命中次数',
  `hit_users` int(11) NOT NULL DEFAULT '0' COMMENT '命中用户数 以wid为维度',
  `r1_int` bigint(20) DEFAULT NULL,
  `r2_int` bigint(20) DEFAULT NULL,
  `r1_string` varchar(64) DEFAULT NULL,
  `r2_string` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`seq_id`),
  KEY `index_grp` (`statis_type`,`risk_id`,`create_time`)
) ENGINE=InnoDB AUTO_INCREMENT=9327 DEFAULT CHARSET=utf8 COMMENT='风险用户Rid命中数统计' 
