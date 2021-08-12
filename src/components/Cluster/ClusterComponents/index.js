/* eslint-disable no-underscore-dangle */
import { Button, Col, Collapse, Icon, Modal, Row } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { getPodEvent, getRainbondComponents } from '../../../services/cloud';
import styles from '../../CreateTeam/index.less';
import styless from './index.less';

const { Panel } = Collapse;

@connect(({ global }) => ({
  rainbondInfo: global.rainbondInfo,
  enterprise: global.enterprise
}))
class ClusterComponents extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      componentInfo: false,
      evens: [],
      list: []
    };
  }
  componentDidMount() {
    this.fetchRainbondComponents();
  }
  fetchRainbondComponents = () => {
    const { eid, clusterID, providerName } = this.props;
    getRainbondComponents({
      clusterID,
      providerName,
      enterprise_id: eid
    }).then(res => {
      this.setState({
        list: (res && res.response_data) || []
      });
    });
  };
  fetchPodEvent = podName => {
    const { eid, clusterID, providerName } = this.props;
    getPodEvent({
      clusterID,
      providerName,
      podName,
      enterprise_id: eid
    }).then(res => {
      this.setState({
        evens: (res && res.response_data) || []
      });
    });
  };
  handleComponentDetails = componentInfo => {
    if (
      componentInfo &&
      componentInfo.metadata &&
      componentInfo.metadata.name
    ) {
      this.fetchPodEvent(componentInfo.metadata.name);
    }
    this.setState({
      componentInfo
    });
  };
  handleStateName = str => {
    const phase = str && str.toLowerCase();
    return phase === 'failed' ? styless.failedState : styless.successState;
  };
  render() {
    const { onCancel } = this.props;
    const { list, evens, componentInfo } = this.state;
    return (
      <Modal
        visible
        title={componentInfo ? '组件详情' : 'Rainbond集群组件'}
        className={styles.TelescopicModal}
        width={1100}
        onCancel={onCancel}
        footer={
          <Button
            style={{ marginTop: '20px' }}
            onClick={() => {
              onCancel();
            }}
          >
            关闭
          </Button>
        }
      >
        {componentInfo ? (
          <div>
            <Icon
              type="arrow-left"
              style={{ fontSize: '20px', color: '#4d73b1' }}
              onClick={() => {
                this.handleComponentDetails(false);
              }}
            />
            <div className={styless.componentHeader}>
              <div>
                Pod:
                {componentInfo.metadata && componentInfo.metadata.name}
              </div>
              <div
                className={this.handleStateName(
                  componentInfo.status && componentInfo.status.phase
                )}
              >
                {componentInfo.status && componentInfo.status.phase}
              </div>
            </div>
            <div className={styless.componentBox}>
              <div>
                <div>
                  <span>命名空间：</span>
                  <span>
                    {componentInfo.metadata && componentInfo.metadata.namespace}
                  </span>
                </div>
                <div style={{ width: '66.66%', border: 'none' }}>
                  <div className={styless.componentBoxs}>
                    <div>镜像：</div>
                    <div>
                      {componentInfo.spec &&
                        componentInfo.spec.containers &&
                        componentInfo.spec.containers.length &&
                        componentInfo.spec.containers[0].image}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <span>Pod IP：</span>
                  <span>
                    {componentInfo.status && componentInfo.status.podIP}
                  </span>
                </div>
                <div>
                  <p>
                    <span>Node：</span>
                    {componentInfo.spec && componentInfo.spec.nodeName}
                  </p>
                  <p>
                    <span>HostIP：</span>
                    {componentInfo.status && componentInfo.status.hostIP}
                  </p>
                </div>
                <div>
                  <p>
                    <span>创建时间：</span>
                    {componentInfo.metadata &&
                      componentInfo.metadata.creationTimestamp &&
                      moment(componentInfo.metadata.creationTimestamp).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )}
                  </p>
                  <p>
                    <span>容器重启次数：</span>
                    {componentInfo.status &&
                      componentInfo.status.containerStatuses &&
                      componentInfo.status.containerStatuses.length &&
                      componentInfo.status.containerStatuses[0].restartCount}
                  </p>
                </div>
              </div>
            </div>
            <Collapse
              defaultActiveKey={['1', '2']}
              onChange={this.handleChange}
              className={styless.customCollapse}
            >
              <Panel
                header={
                  <div className={styless.panelBox}>
                    <div>容器</div>
                    <div>pod中的容器</div>
                  </div>
                }
                key="1"
              >
                <div className={styless.customTables}>
                  <Row className={styless.customTablesTit}>
                    <Col span={4}>状态</Col>
                    <Col span={6}>名称</Col>
                    <Col span={10}>镜像</Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      容器重启次数
                    </Col>
                  </Row>
                  {componentInfo.status &&
                    componentInfo.status.containerStatuses &&
                    componentInfo.status.containerStatuses.length &&
                    componentInfo.status.containerStatuses.map(item => {
                      const { image, state, name, restartCount } = item;
                      return (
                        <Row className={styless.customTableCon}>
                          <Col span={4}>
                            <div
                              className={this.handleStateName(
                                state && Object.keys(state)[0]
                              )}
                            >
                              {state && Object.keys(state)[0]}
                            </div>
                          </Col>
                          <Col span={6}>
                            <a>{name}</a>
                          </Col>
                          <Col span={10}>
                            <span>{image}</span>
                          </Col>
                          <Col span={4} style={{ textAlign: 'center' }}>
                            {restartCount}
                          </Col>
                        </Row>
                      );
                    })}
                </div>
              </Panel>
              <Panel
                header={
                  <div className={styless.panelBox}>
                    <div>事件</div>
                    <div>当前pod的事件</div>
                  </div>
                }
                key="2"
              >
                <div className={styless.customTables}>
                  <Row className={styless.customTablesTit}>
                    <Col span={4}>类型</Col>
                    <Col span={6}>事件原因</Col>
                    <Col span={10}>事件信息</Col>
                    <Col span={4}>最后更新</Col>
                  </Row>
                  {evens && evens.length ? (
                    evens.map(item => {
                      const { type, reason, message, eventTime } = item;
                      return (
                        <Row className={styless.customTableCon}>
                          <Col span={4}>
                            <div className={this.handleStateName(type)}>
                              {type}
                            </div>
                          </Col>
                          <Col span={6}>
                            <span>{reason}</span>
                          </Col>
                          <Col span={10}>
                            <span>{message}</span>
                          </Col>
                          <Col span={4}>
                            {eventTime &&
                              moment(eventTime).format('YYYY-MM-DD HH:mm:ss')}
                          </Col>
                        </Row>
                      );
                    })
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        color: 'rgba(0,0,0,0.35)',
                        marginTop: '15px'
                      }}
                    >
                      没有事件
                    </div>
                  )}
                </div>
              </Panel>
            </Collapse>
          </div>
        ) : (
          <div className={styless.customTables}>
            <Row className={styless.customTablesTit}>
              <Col span={3}>状态</Col>
              <Col span={7}>名称</Col>
              <Col span={14}>镜像</Col>
            </Row>
            <div className={styless.boxs}>
              {list &&
                list.length &&
                list.map(item => {
                  const { app, pods } = item;
                  return (
                    <Row>
                      <Row className={styless.customTableMinTit}>{app}</Row>
                      {pods &&
                        pods.length &&
                        pods.map(items => {
                          const { status, metadata, spec } = items;
                          return (
                            <Row className={styless.customTableCon}>
                              <Col span={3}>
                                <div
                                  className={this.handleStateName(
                                    status && status.phase
                                  )}
                                >
                                  {status && status.phase}
                                </div>
                              </Col>
                              <Col span={7}>
                                <a
                                  onClick={() => {
                                    this.handleComponentDetails(
                                      Object.assign({}, items, { app })
                                    );
                                  }}
                                >
                                  {metadata && metadata.name}
                                </a>
                              </Col>
                              <Col span={14}>
                                <div>
                                  {spec &&
                                    spec.containers &&
                                    spec.containers.length > 0 &&
                                    spec.containers[0].image}
                                </div>
                                <div>
                                  <span style={{ color: '#4d73b1' }}>
                                    {status && status.hostIP}
                                  </span>
                                  <span
                                    style={{ color: 'rgba(0, 0, 0, 0.35)' }}
                                  >
                                    &nbsp;/&nbsp;
                                  </span>
                                  <span style={{ color: '#4d73b1' }}>
                                    {spec && spec.nodeName}
                                  </span>
                                  <span
                                    style={{ color: 'rgba(0, 0, 0, 0.35)' }}
                                  >
                                    &nbsp;/&nbsp;创建时间:
                                    {metadata &&
                                      metadata.creationTimestamp &&
                                      moment(metadata.creationTimestamp).format(
                                        'YYYY-MM-DD HH:mm:ss'
                                      )}
                                  </span>
                                  <span
                                    style={{ color: 'rgba(0, 0, 0, 0.35)' }}
                                  >
                                    &nbsp;/&nbsp; 容器重启次数
                                    {status &&
                                      status.containerStatuses &&
                                      status.containerStatuses.length > 0 &&
                                      status.containerStatuses[0].restartCount}
                                  </span>
                                </div>
                              </Col>
                            </Row>
                          );
                        })}
                    </Row>
                  );
                })}
            </div>
          </div>
        )}
      </Modal>
    );
  }
}
export default ClusterComponents;
