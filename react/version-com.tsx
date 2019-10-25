/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';

import { ShowModal } from 'ukelli-ui/core/modal'
import { Alert } from 'ukelli-ui/core/alert'
import { Notify } from 'ukelli-ui/core/notification'

export interface VersionInfo {
  packageVersion: string;
  buildVersion: string;
  version: string;
  buildDate: string;
  gitHash: string;
  updateLog: string;
}

export interface VersionCheckerProps {
  versionInfo: VersionInfo;
  versionUrl: string;
}
export interface VersionDisplayerProps {
  $T: (str: string) => string;
  /** 版本内容 */
  versionInfo: VersionInfo;
}

declare global {
  interface Window {
    __VERSION: VersionInfo;
  }
}

interface VersionCheckerState {
  currVersion: string;
  lastVersion: string;
  updateLog?: string;
}

class VersionChecker extends Component<VersionCheckerProps, VersionCheckerState> {
  __unmount

  timer

  errorCount

  constructor(props) {
    super(props);

    let { version } = props.versionInfo;

    window.__VERSION = props.versionInfo;

    version = version ? version.trim() : '';
    if(!version) console.warn('需要传入 version');
    
    this.errorCount = 0;

    this.state = {
      currVersion: version,
      lastVersion: version,
    };
  }

  componentDidMount() {
    this.getVersion();
    this.timer = setInterval(this.getVersion, 30 * 60 * 1000);
  }

  componentWillUnmount() {
    this.__unmount = true;
    this._clear();
  }

  _clear = () => {
    this.timer && clearInterval(this.timer);
  };

  getVersion = () => {
    const { versionUrl } = this.props;
    if (!versionUrl) return console.log('请设置版本文件地址 versionUrl');
    if (this.errorCount === 5) return this._clear();
    fetch(`${versionUrl}?t=${Date.now()}`)
      .then((res) => res.json())
      .then((remoteVersion: VersionInfo) => {
        let { version, updateLog } = remoteVersion;
        version = version.trim();
        if (version != this.state.lastVersion) {
          this._clear();
          Notify({
            config: {
              text: '有新的系统版本',
              title: '系统通知',
              type: 'success',
              timer: 0,
              onClickTip: (e) => {
                this.reload();
              },
              actionText: '更新',
            }
          });
          !this.__unmount && this.setState({
            lastVersion: version,
            updateLog
          });
        }
      })
      .catch((e) => {
        this.errorCount++;
      });
  };

  reload = () => {
    const { updateLog, lastVersion } = this.state;
    ShowModal({
      title: '是否更新版本？',
      type: 'confirm',
      width: 400,
      confirmText: (
        <div>
          <div>
            <h4>更新内容:</h4>
            <p>{updateLog || '日常更新'}</p>
          </div>
          <hr />
          <Alert
            type="success"
            text="请确保已保存工作内容，页面即将刷新" />
        </div>
      ),
      onConfirm: (isSure) => {
        if (isSure) {
          location.reload();
        }
      },
    });
  }

  render = () => {
    return <span />;
  }
}

const _$T = str => str;

const VersionDisplayer: React.SFC<VersionDisplayerProps> = (props) => {
  const { versionInfo, $T = _$T, children } = props;
  return (
    <div className="version-container">
      <div>
        {$T('当前版本')} {versionInfo.version}
      </div>
      {children}
      {/* <div>
        © 2018 - {(new Date()).getFullYear()}
      </div> */}
    </div>
  );
};

export {
  VersionChecker,
  VersionDisplayer
};

export default VersionDisplayer;
