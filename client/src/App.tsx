import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Header, Icon, Image, Menu, Segment } from 'semantic-ui-react'
import Auth from './auth/Auth'
import { Category } from './components/Category'
import { EditCategory } from './components/EditCategory'
import { EditWhatever } from './components/EditWhatever'
import { LogIn } from './components/LogIn'
import { Whatever } from './components/Whatever'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment color="red" style={{ padding: '2em' }} vertical inverted>
          <Grid container stackable>

            <Grid.Row color="yellow">
              <Grid.Column width={2} color="pink">
                <Image src="spinning_globe.gif" size="tiny" />
              </Grid.Column>

              <Grid.Column width={14} color="pink" verticalAlign="middle">
                <Header as="h1">Whatever You Want</Header>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row color="yellow">
              <Grid.Column width={2} color="pink" />

              <Grid.Column width={14} color="pink" verticalAlign="middle">
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>

          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="category">
          <Link to="/category">
            <Icon name="warehouse" />
            Categories
          </Link>
        </Menu.Item>

        <Menu.Item name="items">
          <Link to="/whatever">
            <Icon name="boxes" />
            Items
          </Link>
        </Menu.Item>

        <Menu.Menu position="right">
          {/* {this.userName()} */}
          {this.logInLogOutButton()}
        </Menu.Menu>
      </Menu>
    )
  }

  // userName() {
  //   if (this.props.auth.isAuthenticated()) {
  //     return (
  //       <Menu.Item name="username">
  //         <Icon name="user" />
  //         User Name Is?
  //       </Menu.Item>
  //     )
  //   } else {
  //     return (
  //       <Menu.Item name="nousername">
  //         <Icon name="user outline" />
  //         NOT LOGGED IN
  //       </Menu.Item>
  //     )
  //   }
  // }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          <Icon name="lock open" color="green" />
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          <Icon name="lock" color="red" />
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/category"
          exact
          render={(props) => {
            return <Category {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/whatever"
          exact
          render={(props) => {
            return <Whatever {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/whatever/:itemId/edit"
          exact
          render={(props) => {
            return <EditWhatever {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/category/:itemId/edit"
          exact
          render={(props) => {
            return <EditCategory {...props} auth={this.props.auth} />
          }}
        />
      </Switch>
    )
  }
}
