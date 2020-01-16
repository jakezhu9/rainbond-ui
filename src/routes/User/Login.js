import React, { Component } from "react";
import { connect } from "dva";
import { Divider, Row, Col } from "antd";
import styles from "./Login.less";
import rainbondUtil from "../../utils/rainbond";
import LoginComponent from "./loginComponent";
import oauthUtil from "../../utils/oauth";

@connect(({ global }) => ({
  isRegist: global.isRegist,
  rainbondInfo: global.rainbondInfo
}))
export default class LoginPage extends Component {
  handleSubmit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/login",
      payload: {
        ...values
      }
    });
  };
  componentWillMount() {
    //check auto login
    const { rainbondInfo } = this.props;
    let disable_auto_login = rainbondUtil.OauthParameter("disable_auto_login");
    if (rainbondUtil.OauthbEnable(rainbondInfo)) {
      rainbondInfo.oauth_services.value.map(item => {
        const { is_auto_login } = item;
        if (is_auto_login && disable_auto_login != "true") {
          window.location.href = oauthUtil.getAuthredictURL(item);
        }
      });
    }
  }

  render() {
    const { rainbondInfo } = this.props;

    return (
      <div className={styles.main}>
        <LoginComponent onSubmit={this.handleSubmit} type="login" />
        {rainbondUtil.OauthbEnable(rainbondInfo) &&
          rainbondInfo &&
          rainbondInfo.oauth_services.value.length > 0 && (
            <div className={styles.thirdBox}>
              <Divider>
                <div className={styles.thirdLoadingTitle}>第三方登录</div>
              </Divider>
              <Row className={styles.third}>
                {rainbondInfo &&
                  rainbondInfo.oauth_services.value.length > 0 &&
                  rainbondInfo.oauth_services.value.map(item => {
                    const { name, client_id } = item;
                    let url = oauthUtil.getAuthredictURL(item);
                    let icon = oauthUtil.getIcon(item);
                    return (
                      <Col span="8" className={styles.thirdCol} key={client_id}>
                        <a href={url}>
                          {icon}
                          <p>{name}</p>
                        </a>
                      </Col>
                    );
                  })}
              </Row>
            </div>
          )}
      </div>
    );
  }
}
