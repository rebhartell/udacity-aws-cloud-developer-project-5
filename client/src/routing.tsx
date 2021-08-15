import createHistory from 'history/createBrowserHistory'
import React from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import App from './App'
import Auth from './auth/Auth'
import Callback from './components/Callback'
import { NotFound } from './components/NotFound'
const history = createHistory()

const auth = new Auth(history)

const handleAuthentication = (props: any) => {
  const location = props.location
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication()
  }
}

export const makeAuthRouting = () => {
  return (
    <Router history={history}>
      <div>
        <Route
          path="/callback"
          render={(props) => {
            handleAuthentication(props)
            return <Callback />
          }}
        />

        <Switch>
          
          <Route
            path="/"
            render={(props) => {
              return <App auth={auth} {...props} />
            }}
          />

          <Redirect from="/" to="/category" exact/>

          <Route component={NotFound} />

        </Switch>

      </div>
    </Router>
  )
}
