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
  Icon,
} from 'antd';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import If from './If';
import FileView from './FileView';

const { Header, Content, Footer } = Layout;

const REPO_DETAILS = gql`
  query repository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      name
      url
      description
      object(expression: "master:") {
        ... on Tree {
          entries {
            name
            type
            object {
              ... on Blob {
                text
              }
            }
          }
        }
      }
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
        <Content style={{ paddingTop: 15 }}>
          <Row type="flex" justify="center">
            <Col xs={{ span: 24 }} lg={{ span: 18 }}>
              <Query query={REPO_DETAILS} variables={{ name, owner }}>
                {({ loading, error, data }) => {
                  if (error) return <p>Error :(</p>;
                  if (loading) return <Card loading={true} />;

                  const { repository } = data;
                  const repo = repository;
                  console.log(repo);

                  const readMe = repo.object.entries.find(file => {
                    return file.name.toLowerCase().includes('readme');
                  });

                  return (
                    <Card
                      title={
                        <a target="_blank" href={repo.url}>
                          {repo.name.replace(/-/g, ' ')}
                        </a>
                      }
                      extra={
                        <div>
                          <Icon type="star" /> {repo.stargazers.totalCount}
                        </div>
                      }
                    >
                      <Card.Meta
                        description={
                          <div>
                            <div>{repo.description}</div>
                            <div style={{ marginTop: 10 }}>
                              {repo.languages.nodes.map(language => (
                                <Tag key={language.name} color={language.color}>
                                  {language.name}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        }
                        style={{
                          marginBottom: 12,
                          paddingBottom: 12,
                        }}
                      />
                      <FileView files={repo.object.entries} />
                      <div className="readme-section">
                        <If condition={repo.object !== null}>
                          <ReactMarkdown
                            source={
                              readMe.object.text || ''
                            }
                          />
                        </If>
                        <If condition={repo.object === null}>
                          No ReadMe Found
                        </If>
                      </div>
                      {repo.languages.nodes.length === 0 && (
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
