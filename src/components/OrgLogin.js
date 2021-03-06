import React from 'react'
import { connect } from 'react-redux'
import { FaGooglePlusSquare, FaFacebookSquare } from 'react-icons/lib/fa'
import { Button } from 'react-bootstrap'
import { firebase } from '../firebase/FlyersFirebase'
import { getCurrentUser, fetchDataOn, signinOrg } from '../firebase'
import { LoginUserAction } from '../redux/actions'

const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};

class OrgLoginForm extends React.Component {
  constructor(props){
    super(props)
    this.onSignin=this.onSignin.bind(this)
  }

  ProviderSelect(id){
    var provider
    switch(id){
      case'org-google':
      provider = new firebase.auth.GoogleAuthProvider();
      break;
      case 'org-facebook':
      provider = new firebase.auth.FacebookAuthProvider();
      break;
      default:
      provider = null
    }
    return provider
  }

  onSignin(e){
    e.preventDefault();
    var provider = this.ProviderSelect(e.target.id)
    signinOrg(provider)
  }

  //TODO: store org data to state
  componentWillUnmount(){
    const { dispatch } = this.props;
    getCurrentUser().then((user) =>{
      if(user){
        fetchDataOn(`users/${user.uid}`)
        .then(snap => {
          var userData = snap.val()
          //get the user firebase's auth data
          const userDataOnAuth = {
              displayName: user.displayName,
              email: user.email,
              emailVerified: user.emailVerified,
              isAnonymous: user.isAnonymous,
              photoURL: user.photoURL,
              providerData: user.providerData,
              uid: user.uid,
              isOrg: userData.isOrg ? true : false
          }
          //merge it with our firebase data
          const userDataToState = Object.assign(userDataOnAuth, userData)
          //dispatch it
          dispatch(LoginUserAction(userDataToState))
        })
      }
    })
  }

  render () {
    return (
        <form className="text-center well" style={wellStyles}>
            <Button type='button' bsStyle='danger' block id='org-google' onClick={this.onSignin}><FaGooglePlusSquare size={30}/>Sign in with Google</Button>
            <Button type='button' bsStyle='info' block id='org-facebook' onClick={this.onSignin}><FaFacebookSquare size={30}/>Sign in with Facebook</Button>
        </form>
    )
  }
}

const OrgLogin = connect()(OrgLoginForm)

export { OrgLogin }
