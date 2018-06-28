import React, { Component } from 'react';
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

const REPO_DETAILS = gql`
  query repository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      name
      defaultBranchRef {
        id
      }
      stargazers {
        totalCount
      }
      languages(first: 10) {
        nodes {
          name
          color
        }
      }
    }
  }
`;

class RepoPage extends Component {
  render() {
    const { owner, name } = this.props.match.params;
    console.log(owner, name);
    return (
      <Layout className="layout">
        <Header>
          <div className="logo">
            <Link to="/">Github Browser</Link>
          </div>
        </Header>
        <Content style={{ padding: '25px 50px' }}>
          <Row type="flex" justify="center">
            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
              <Query query={REPO_DETAILS} variables={{ name, owner }}>
                {({ loading, error, data }) => {
                  if (error) return <p>Error :(</p>;
                  if (loading) return <p>Loading</p>;
                  const { repository } = data;
                  console.log(repository);
                  return (
                    // <div>
                    //   <div>Stars: {repository.stargazers.totalCount}</div>
                    // </div>
                    <Card title={repository.name.replace(/-/g, ' ')}>
                      <div>{repository.description}</div>
                      {/* <div>Size: {prettyBytes(repository.diskUsage)}</div> */}
                      <div>Languages:</div>
                      {repository.languages.nodes.map(language => (
                        <Tag key={language.name} color={language.color}>
                          {language.name}
                        </Tag>
                      ))}
                      {repository.languages.nodes.length === 0 && (
                        <Tag>No Languages Detected</Tag>
                      )}
                    </Card>
                  );
                }}
              </Query>
            </Col>
          </Row>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Github GraphQL</Footer>
      </Layout>
    );
  }
}

export default RepoPage;
