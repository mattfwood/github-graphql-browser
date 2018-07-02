import React, { Component } from 'react';
import { List, Icon, Modal } from 'antd';
// import Highlight from 'react-highlight';
import SyntaxHighlighter from 'react-syntax-highlighter';
import styles from 'react-syntax-highlighter/styles/hljs/monokai-sublime';
import detect from 'language-detect';
import If from './If';

console.log(styles);

class FileView extends Component {
  state = {
    modalVisible: false,
    activeFile: {
      object: {
        text: '',
      },
    },
  };

  viewFile = file => {
    if (file.type !== 'tree') {
      this.setState({
        activeFile: file,
        modalVisible: true,
      });
    }
  };

  handleClose = e => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { files } = this.props;
    return (
      <div>
        <List
          bordered
          itemLayout="horizontal"
          dataSource={files}
          renderItem={file => {
            const FileIcon = () => {
              if (file.type === 'tree') {
                return <Icon type="folder" />;
              }

              return <Icon type="file-text" />;
            };
            return (
              <List.Item onClick={() => this.viewFile(file)}>
                <div>
                  <FileIcon />
                  {'  '}
                  {file.name}
                </div>
              </List.Item>
            );
          }}
        />
        <Modal
          visible={this.state.modalVisible}
          onCancel={this.handleClose}
          title={this.state.activeFile.name}
          footer={null}
          style={{ top: 20 }}
          width="80vw"
        >
          <If condition={this.state.activeFile.object}>
            <SyntaxHighlighter
              language={detect.filename(this.state.activeFile.name) || ''}
              style={styles}
            >
              {this.state.activeFile.object.text}
            </SyntaxHighlighter>
          </If>
        </Modal>
      </div>
    );
  }
}

export default FileView;
