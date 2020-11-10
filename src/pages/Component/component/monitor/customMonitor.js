/* eslint-disable react/no-unused-state */
/* eslint-disable import/extensions */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Row, notification, Alert, Col } from 'antd';
import MonitoryPoint from './monitoryPoint';
import ConfirmModal from '@/components/ConfirmModal';
import CustomMonitoring from '@/components/CustomMonitoring';
import CustomChart from '@/components/CustomChart';
import globalUtil from '@//utils/global';
import roleUtil from '@/utils/role';
import Result from '@/components/Result';

/* eslint react/no-array-index-key: 0 */

@connect(({ appControl }) => ({
  appDetail: appControl.appDetail
}))
export default class customMonitor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMonitoryPoint: false,
      isCustomMonitoring: false
    };
  }
  componentWillMount() {
    const { dispatch } = this.props;
  }
  handleMonitoryPoint = (isMonitoryPoint) => {
    this.setState({
      isMonitoryPoint
    });
  };
  handleCustomMonitoring = (isCustomMonitoring) => {
    this.setState({
      isCustomMonitoring
    });
  };

  render() {
    const { appDetail } = this.props;
    const serviceId = appDetail.service.service_id;
    const { isMonitoryPoint, isCustomMonitoring } = this.state;
    return (
      <div>
        {!isMonitoryPoint && (
          <Row>
            <CustomChart
              moduleName="PerformanceAnalysis"
              // RangeData={['responseTime']}
              operation={
                <div style={{ display: 'inline-block', width: '88%' }}>
                  <Button
                    icon="plus"
                    style={{ marginLeft: '5px' }}
                    onClick={() => {
                      this.handleCustomMonitoring(true);
                    }}
                  >
                    添加图表
                  </Button>
                  <Button
                    style={{ marginLeft: '5px' }}
                    onClick={() => {
                      this.handleCustomMonitoring(true);
                    }}
                  >
                    一键导入
                  </Button>
                  <Button
                    style={{ float: 'right', marginTop: '4px' }}
                    onClick={() => {
                      this.handleMonitoryPoint(true);
                    }}
                  >
                    管理监控点
                  </Button>
                </div>
              }
            />
          </Row>
        )}
        {!isMonitoryPoint && !isCustomMonitoring && (
          <Result
            style={{ background: '#fff', marginTop: '10px', padding: '20px' }}
            type="warning"
            description="暂无业务监控图、请先添加管理监控点"
          />
        )}

        {isCustomMonitoring && (
          <CustomMonitoring
            serviceId={serviceId}
            onCancel={() => {
              this.handleCustomMonitoring(false);
            }}
          />
        )}
        {isMonitoryPoint && <MonitoryPoint {...this.props} />}
      </div>
    );
  }
}
