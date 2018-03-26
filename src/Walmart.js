import React, { Component } from 'react';
import "./Walmart.css";
import brand from './brand.png';

var reqwest = require('reqwest');

/**
    <Walmart
        search="ketchup"
        title="search goods from Walmart API"
    />
*
**/

export default class Walmart extends Component {
    state = {
        loading: true,
        hidemore: false,
        error: null,
        data: null,
        searchkey: '',
        searchBy: {
            sort: 'price',
            order: 'asc'
        },
        sortFields: ['relevance', 'price', 'title', 'bestseller', 'customerRating', 'new'],
        facetFilter: null,
        facetRange: null
    };


    apiKey = "mvwyfxq9tjg8tntp8xp5jwtu";

    getSearchUrl(searchKey) {
        const searchBy = this.state.searchBy;
        let url = `http://api.walmartlabs.com/v1/search?query=${searchKey}&format=json&apiKey=${this.apiKey}&facet=on&sort=${searchBy.sort}&order=${searchBy.order}`;

        if(this.state.facetFilter){
            url = `${url}&facet.filter=${this.state.facetFilter.join(':')}`;
        }

        return url;
    }

    componentDidMount() {
        const search =  decodeURIComponent(this.props.match.params.search);
        this.searchAPI(search);
    }

    searchAPI(searchkey, clearOptions){
        const newState= {loading: true, data: null, error: null};
        if(clearOptions){
            newState.facetFilter = null;
            newState.facetRange = null;
        }

        this.setState(newState, () => {
            searchkey = searchkey || this.state.searchkey;

            reqwest({
                url:this.getSearchUrl(searchkey),
                type: 'jsonp',
                jsonpCallback: 'callback'
            }).then(
                value => this.setState({
                    loading: false,
                    data: value,
                    searchkey: searchkey
                }),
                error => this.setState({
                    loading: false,
                    error: error,
                    searchkey: searchkey
                })
            );
        });
    }

    onInputChanged(e) {
        const search = e.target.value;
        this.setState({
            'searchkey': search
        });
    }

    onInputKeyUp(e) {
        if (e.which === 13) {
            const search = e.target.value;
            this.searchAPI(search, true);
        }
    }

    onMoreOptionItemClicked(optKey, optValue){
        optValue = optValue.replace(/\s+/, '+');
        this.setState({
            facetFilter: [optKey, optValue]
        }, () => {
            this.searchAPI();
        });
    }

    getFacetItemClass(optKey, optValue){
        optValue = optValue.replace(/\s+/, '+');
        if(!this.state.facetFilter) {
            return '';
        } else if(this.state.facetFilter[0] === optKey && this.state.facetFilter[1] === optValue) {
            return 'active';
        }
    }

    onSortChanged(sortfield, e) {
        this.setState((prevState) => {
            const newSearchBy = {
                sort: sortfield
            };

            if(sortfield === prevState.searchBy.sort) {
                newSearchBy.order = prevState.searchBy.order === 'asc' ? 'desc' : 'asc';
            } else {
                newSearchBy.order = 'asc';
            }


            this.setState({
                searchBy: newSearchBy
            });

        }, () => {
            this.searchAPI();    
        });
    }

    onHideMore(e){
        this.setState((prevState) => ({
            hidemore: !prevState.hidemore
        }));
    }


    render(){
        var walmartSearchResults;

        if (this.state.loading) {
          walmartSearchResults = <li>Searching...</li>;
        }
        else if (this.state.error !== null) {
          walmartSearchResults = <li>Error: {this.state.error.message}</li>;
        }

        else {
          var repos = this.state.data && this.state.data.items;


          if (repos && repos.length){
                walmartSearchResults = repos.map(function (repo, i) {
                return (
                  <li key={i}>
                    <figure>
                        <img
                          src={repo.thumbnailImage}
                          alt={repo.name} /> 

                        <figcaption>
                            <span className="name">{repo.name}</span>
                            <span className="price">${repo.salePrice}</span>
                        </figcaption>
                    </figure>
                  </li>
                );
              });
          } else {
                walmartSearchResults = <li> {this.state.data.message} </li>;
          }
        }

        const facets = this.state.data ? this.state.data.facets : [];

        return (
            <main className="Walmart">
                <div className="search-bar-heading">
                    <img className="brand" src={brand} alt="walmart brand logo"/>
                    <input className="input-box" type="text" 
                        value={this.state.searchkey} 
                        onChange={this.onInputChanged.bind(this)}
                        onKeyUp={this.onInputKeyUp.bind(this)}
                    />
                </div>
                
                <dl className="search-info-bar">
                    <dt>total Results:</dt><dd>{this.state.data ? this.state.data.totalResults : 0}</dd>
                </dl>
                <div className="search-info-bar clickable" onClick={this.onHideMore.bind(this)}>
                    More Options
                </div>

                <dl className="search-info-bar right">
                    <dt>sort By:</dt>
                    <dd>
                        <ul className="search-info-bar-sort-fields hor-clickable-list">
                            {
                                this.state.sortFields.map((sortf, i) => {
                                    return <li key={i} onClick={this.onSortChanged.bind(this, sortf)}
                                        className={sortf === this.state.searchBy.sort ? 'active' : ''}
                                    >
                                        {sortf} {sortf === this.state.searchBy.sort && this.state.searchBy.order === 'desc' ? 'v': '^'}
                                    </li>
                                })

                            }
                        </ul>
                    </dd>
                </dl>

                <div className={["search-more-options", this.state.hidemore ? 'hide': ''].join(' ')}>
                    {
                        facets.map((facet,i) => (
                            <dl key={i}>
                                <dt>{facet.displayName}</dt>
                                <dd><ul className="hor-clickable-list">
                                    {
                                        facet.facetValues.map((facetValue, ii) => (
                                            <li key={ii} 
                                                onClick={this.onMoreOptionItemClicked.bind(this, facet.name, facetValue.name)}
                                                className={this.getFacetItemClass(facet.name, facetValue.name)}
                                                >
                                            {facetValue.name}
                                            </li>
                                        ))
                                    }
                                    </ul>
                                </dd>
                            </dl>
                        ))
                    }
                </div>
                
                <ol className="Walmart-image-list">{walmartSearchResults}</ol>
            </main>
          );
    }
}