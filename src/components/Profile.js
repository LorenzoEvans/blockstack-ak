import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Profile extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
  	  username: '',
  	  newStatus: '',
  	  posts: [],
      postIndex: 0,
      isLoading: false,
  	};
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
      username: userSession.loadUserData().username
    });
  }


  saveNewStatus = () => {

  };


  handleNewStatusChange = (event) => {
    this.setState({newStatus: event.target.value});
  };
  handleNewStatusSubmit = (event) => {
    this.saveNewStatus(this.state.newStatus);
    this.setState({
      newStatus: ''
    })
  };


  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    const { username } = this.state;

    return (
      !userSession.isSignInPending() && person ?
        <div className="container">
          <div className="row">
            <div className="col-md-offset-3 col-md-6">
              <div className="col-md-12">
                <div className="avatar-section">
                  <img
                    src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage }
                    className="img-rounded avatar"
                    id="avatar-image"
                  />
                  <div className="username">
                    <h1>
                   <span id="heading-name">{ person.name() ? person.name()
                     : 'Nameless Person' }</span>
                    </h1>
                    <span>{username}</span>
                    <span>
                   &nbsp;| &nbsp;
                      <a onClick={ handleSignOut.bind(this) }>(Logout)</a>
                 </span>
                  </div>
                </div>
              </div>

              <div className="new-status">
                <div className="col-md-12">
               <textarea className="input-status"
                         value={this.state.newStatus}
                         onChange={e => this.handleNewStatusChange(e)}
                         placeholder="Enter a status"
               />
                </div>
                <div className="col-md-12">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={e => this.handleNewStatusSubmit(e)}
                  >
                    Submit
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div> : null
    );
  }}
