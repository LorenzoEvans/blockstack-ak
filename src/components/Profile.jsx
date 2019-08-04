import React, { Component } from 'react';
import {
  Person,
  lookupProfile,
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

  componentDidMount() {
    this.fetchData()
  }

  isLocal() {
    return this.props.match.params.username ? false : true
  }
  saveNewStatus(text){
  const { userSession } = this.props;
  let posts = this.state.posts;
  let post = {
    id: this.state.postIndex++,
    text: text.trim(),
    created_at: Date.now()
  };
  posts.unshift(post);
  const options = {encrypt: false};
  userSession.putFile('posts.json', JSON.stringify(posts), options)
    .then(() => {
      this.setState({
      posts: posts
      })
    })
  };

  fetchData(){
  const { userSession } = this.props;
  this.setState({isLoading: true});

    if (this.isLocal()) {
      const options = {decrypt: false};
      userSession.getFile('posts.json', options)
        .then((file) => {
          let posts = JSON.parse(file || '[]');
          this.setState({
            person: new Person(userSession.loadUserData().profile),
            username: userSession.loadUserData().username,
            statusIndex: posts.length,
            posts: posts,
          })
        })
        .finally(() => {
          this.setState({isLoading: false})
        })
        .catch((error) => {
        console.log(error.message)
        })
    } else {
      const username = this.props.match.params.username;

      lookupProfile(username)
        .then((profile) => {
          this.setState({
          person: new Person(profile),
          username: username
          })
        })
        .catch((error) => {
          console.log({error: error.message, message: 'Could not resolve profile.'})
        })
    }
  }

  handleNewStatusChange(event){
    this.setState({newStatus: event.target.value});
  };
  handleNewStatusSubmit(){
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
               <div className="col-md-12 statuses">
                 {this.state.isLoading && <span>Loading...</span>}
                 {this.state.posts.map((post) => (
                   <div className="status" key={status.id}>
                     <h5>{post.text}</h5>
                   </div>
                 ))}
               </div>
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

