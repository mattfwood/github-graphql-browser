import React, { Component } from 'react';
import './App.css';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Layout,
  Menu,
  Breadcrumb,
  List,
  Card,
  Tag,
  Input,
  Row,
  Col,
} from 'antd';
const { Header, Content, Footer } = Layout;
const Search = Input.Search;

const STARRED_REPOS = gql`
  query repos($username: String!) {
    user(login: $username) {
      login
      pinnedRepositories(first: 50) {
        nodes {
          id
          name
          description
          diskUsage
          languages(first: 10) {
            nodes {
              name
              color
            }
          }
          url
        }
      }
    }
  }
`;

class App extends Component {
  state = {
    username: 'wesbos',
  };

  changeUsername = username => {
    console.log(username);
    this.setState({ username });
  };

  render() {
    const { username } = this.state;
    return (
      <Layout className="layout">
        <Header>
          <div className="logo">
            <div>Github Browser</div>
          </div>
        </Header>
        <Content style={{ padding: '25px 50px' }}>
          <Row type="flex" justify="center">
            <Col xs={{ span: 12 }} lg={{ span: 6 }}>
              <Search
                placeholder="Github Username"
                enterButton="Search"
                size="large"
                onSearch={value => this.changeUsername(value)}
                style={{ marginBottom: 30 }}
              />
            </Col>
          </Row>
          <Query query={STARRED_REPOS} variables={{ username }}>
            {({ loading, error, data }) => {
              if (error) return <p>Error :(</p>;

              // show six placeholder cards while loading
              if (loading)
                return (
                  <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={[1, 2, 3, 4, 5, 6]}
                    renderItem={item => (
                      <List.Item key={item}>
                        <Card loading={true} />
                      </List.Item>
                    )}
                  />
                );

              const repos = data.user.pinnedRepositories.nodes;

              return (
                <List
                  grid={{ gutter: 16, column: 3 }}
                  dataSource={repos}
                  renderItem={repo => (
                    <List.Item key={repo.id}>
                      <Card title={repo.name.replace(/-/g, ' ')}>
                        <div>{repo.description}</div>
                        {/* <div>Size: {prettyBytes(repo.diskUsage)}</div> */}
                        <div>Languages:</div>
                        {repo.languages.nodes.map(language => (
                          <Tag color={language.color}>{language.name}</Tag>
                        ))}
                      </Card>
                    </List.Item>
                  )}
                />
              );
            }}
          </Query>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Github GraphQL</Footer>
      </Layout>
    );
  }
}

export default App;
