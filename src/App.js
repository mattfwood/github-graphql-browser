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
import { Link } from 'react-router-dom';

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
            <Link to="/">Github Browser</Link>
          </div>
        </Header>
        <Content style={{ padding: '25px 50px' }}>
          <Row type="flex" justify="center">
            <Col xs={{ span: 12 }} lg={{ span: 6 }}>
              <Search
                defaultValue="WesBos"
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
                      <Link to={`/${this.state.username}/${repo.name}`}>
                      <Card title={repo.name.replace(/-/g, ' ')}>
                        <div>{repo.description}</div>
                        {/* <div>Size: {prettyBytes(repo.diskUsage)}</div> */}
                        <div>Languages:</div>
                        {repo.languages.nodes.map(language => (
                          <Tag key={language.name} color={language.color}>{language.name}</Tag>
                        ))}
                        {repo.languages.nodes.length === 0 && (
                          <Tag>No Languages Detected</Tag>
                        )}
                      </Card>
                      </Link>
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
