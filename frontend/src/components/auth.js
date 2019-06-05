import React,  {Component} from 'react';
import './auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {
    state = {
        isLogin: true
    }

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    static contextType = AuthContext;

    switchModeHandler = () => {
        this.setState(preState => {
            return { isLogin: !preState.isLogin}
        })
    }

    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        localStorage.setItem("email", email);
        if( email.trim().length === 0 || password.trim().length === 0){
            return;
        }
        var requestBody = {
            query: `
                query{
                    login(email: "${email}", password: "${password}"){
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        }
        if(!this.state.isLogin) {
            requestBody = {
                query: `
                  mutation {
                      createUser(userInput: {email: "${email}", password: "${password}"}){
                          _id
                          email
                      }
                  }
                `  
            };
      
        }
        
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body : JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json()
        })
        .then(resData => {
            if(resData.data.login.token){
                this.context.login(
                    resData.data.login.token,
                    resData.data.login.userId,
                    resData.data.login.tokenExpiration
                );
            }
        })
        .catch(err => {
            console.log(err);
        }); 
    }
    render() {
        return (
                <div className="text-center">
                <form className="form-signin" onSubmit={this.submitHandler}>
                    <h1 className="h3 mb-3 font-weight-normal">Please {this.state.isLogin ? 'Login': 'Signup'}</h1>
                    <label  className="sr-only">Email address</label>
                    <input type="email" id="inputEmail" ref={this.emailEl} className="form-control" placeholder="Email address" required  />
                    <label className="sr-only">Password</label>
                    <input type="password" id="inputPassword" ref={this.passwordEl} className="form-control" placeholder="Password" required />
                    
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                    <p className="mt-5 mb-3 text-muted"> Made by Vidit Khemka</p>
                    <a  onClick={this.switchModeHandler} className="badge badge-light">
                        Switch to {this.state.isLogin ? 'Signup': 'Login'}
                    </a>

                </form>
                </div>
        );
    }
}

export default AuthPage;