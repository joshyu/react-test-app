import React, { Component } from 'react';
import UserLabel from './UserLabel';

export default class UserList extends Component {
  state = {
    users: []
  }

  componentDidMount() {
    this.setState({
      users: [
        {
           firstname: 'peng',
            lastname: 'yu' 
        },
        {
           firstname: 'hao',
            lastname: 'liu' 
        },
        {
           firstname: 'xixi',
            lastname: 'yu' 
        }
      ]
    });
  }

  onUserLabelClicked(user, e){
     console.log(`glad to see you, ${user.firstname}`);
  }

  render() {
    const props = {
      className: 'user-label-comp',
      data: 'xxxx'
    };

    const ChildTag = UserLabel;

    return (
      <ul className="user-list">
        {
            this.state.users.map((user,i) => (
                <ChildTag key={i} 
                  user={user} 
                  onClick={this.onUserLabelClicked.bind(this, user)}
                  {...props}
                />
            ))
        }
      </ul>
    );
  }
}
