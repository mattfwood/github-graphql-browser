import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { List, Icon } from 'antd';

const REPO_FILES = gql`
  query repository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      name
      url
      object(expression: "master:") {
        ... on Tree {
          entries {
            name
            type
          }
        }
      }
    }
  }
`;

class FileView extends Component {
  render() {
    const { name, owner } = this.props;
    return (
      <div>
        <Query query={REPO_FILES} variables={{ name, owner }}>
          {({ loading, error, data }) => {
            if (error) return <p>Error :(</p>;
            if (loading) return <p>Loading</p>;

            const files = data.repository.object.entries;

            console.log(files);

            return (
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
                    <List.Item>
                      {/* <List.Item.Meta
                        title={file.name}
                        // avatar={<FileIcon />}
                        avatar={<Icon type="folder" />}
                      /> */}
                      <div>
                        <FileIcon />
                        {'  '}
                        {file.name}
                      </div>
                    </List.Item>
                  );
                }}
              />
            );
          }}
        </Query>
      </div>
    );
  }
}

export default FileView;
