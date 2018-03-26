import React, { Component } from 'react';
import "./RepoList.css";

/**
*  <RepoList
        promise={fetch('https://api.github.com/search/repositories?q=javascript&sort=stars')}
        title="Most Popular JavaScript Projects in Github"
    />

    or 
    <RepoList
        search="javascript"
        title="Most Popular JavaScript Projects in Github"
    />
*
**/

export default class RepoList extends Component {
    state = {
        loading: true,
        error: null,
        data: null
    };

    componentDidMount() {
        const search = this.searchkey = decodeURIComponent(this.props.match.params.search);

        fetch(`https://api.github.com/search/repositories?q=${search}&sort=stars`)
        .then(
            resp=> resp.json()
        ).then(
            value => this.setState({
                loading: false,
                data: value
            }),
            error => this.setState({
                loading: false,
                error: error
            })
        );
        
    }

    render(){
        if (this.state.loading) {
          return <span>searching ...</span>;
        }
        else if (this.state.error !== null) {
          return <span>Error: {this.state.error.message}</span>;
        }
        else {
          var repos = this.state.data.items;
          var repoList = repos.map(function (repo, i) {
            return (
              <li key={i}>
                <a href={repo.html_url}>{repo.name}</a> ({repo.stargazers_count} stars) <br/> {repo.description}
              </li>
            );
          });
          return (
            <main className="RepoList">
              <h1>Most Popular {this.searchkey} Projects in Github</h1>
              <ol>{repoList}</ol>
            </main>
          );
        }
    }
}