import React, { Component } from 'react';

export default class UserLabel extends Component {
    state = {
        active: false
    }

    onButClicked(e){
        e.preventDefault();
        this.setState(prevState => ({
            active: !prevState.active
        }));

        this.props.onClick(e);
        console.log(`Hi, ${this.props.user.lastname} ${this.props.user.firstname}`);
    }

    render(){
       return (<div className={'user-label-comp ' + (this.state.active && 'active')}>
            Hi, {this.props.user.lastname} {this.props.user.firstname} 
            <div> {this.props.data} </div>
            <button onClick={this.onButClicked.bind(this)}> sayHi</button>
        </div>); 
    }
}