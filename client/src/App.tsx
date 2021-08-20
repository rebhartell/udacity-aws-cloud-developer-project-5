import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Header, Icon, Image, Menu, Segment } from 'semantic-ui-react'
import Auth from './auth/Auth'
import { AttachToWhatever } from './components/AttachToWhatever'
import { Category } from './components/Category'
import { EditCategory } from './components/EditCategory'
import { EditWhatever } from './components/EditWhatever'
import { LogIn } from './components/LogIn'
import { Whatever } from './components/Whatever'

const NOT_SELECTED: string = 'Not Selected'

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {
  categoryId: string
  categoryName: string
  whateverId: string
  whateverName: string
}

export default class App extends Component<AppProps, AppState> {
  state: AppState = {
    categoryId: NOT_SELECTED,
    categoryName: '',
    whateverId: NOT_SELECTED,
    whateverName: ''
  }

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

  updateCategory = (id: string, name: string): void => {
    this.setState({
      categoryId: id,
      categoryName: name,
      whateverId: NOT_SELECTED,
      whateverName: ''
    })
  }

  updateWhatever = (id: string, name: string): void => {
    this.setState({ whateverId: id, whateverName: name })
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
                <Header as="h1" textAlign="left">
                  Whatever You Want
                </Header>
              </Grid.Column>

              {/* <Grid.Column width={5} color="pink" verticalAlign="middle">
                <Header as="h3" textAlign="left">
                  categoryId={this.state.categoryId}
                </Header>
                <Header as="h3" textAlign="left">
                  categoryName={this.state.categoryName}
                </Header>
              </Grid.Column>

              <Grid.Column width={5} color="pink" verticalAlign="middle">
                <Header as="h3" textAlign="left">
                  whateverId={this.state.whateverId}
                </Header>
                <Header as="h3" textAlign="left">
                  whateverName={this.state.whateverName}
                </Header>
              </Grid.Column> */}

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
        {this.renderCategoriesMenu()}
        {this.renderSelectedCategory()}

        {this.renderWhateverMenu()}
        {this.renderSelectedWhatever()}

        <Menu.Menu position="right">
          {/* {this.userName()} */}
          {this.logInLogOutButton()}
        </Menu.Menu>
      </Menu>
    )
  }

  renderCategoriesMenu() {
    if (!this.props.auth.isAuthenticated()) {
      return null
    }

    return (
      <Menu.Item name="category">
        <Link
          to={'/category'}
          onClick={() => this.updateCategory(NOT_SELECTED, '')}
        >
          <Icon name="warehouse" />
          Categories
        </Link>
      </Menu.Item>
    )
  }

  renderSelectedCategory() {
    if (this.state.categoryId === NOT_SELECTED) {
      return null
    }

    return <Menu.Item header>{this.state.categoryName}</Menu.Item>
  }

  renderWhateverMenu() {
    if (this.state.categoryId === NOT_SELECTED) {
      return null
    }

    return (
      <Menu.Item name="items">
        <Link
          to={`/category/${this.state.categoryId}/whatever`}
          onClick={() => 
            this.updateWhatever(NOT_SELECTED, '')
          }
        >
          <Icon name="boxes" />
          Items
        </Link>
      </Menu.Item>
    )
  }

  renderSelectedWhatever() {
    if (this.state.whateverId === NOT_SELECTED) {
      return null
    }

    return <Menu.Item header>{this.state.whateverName}</Menu.Item>
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
            return (
              <Category
                {...props}
                auth={this.props.auth}
                updateCategory={this.updateCategory}
              />
            )
          }}
        />

        <Route
          path="/category/:categoryId/whatever/:whateverId/edit"
          exact
          render={(props) => {
            return <EditWhatever {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/category/:categoryId/edit"
          exact
          render={(props) => {
            return <EditCategory {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/category/:categoryId/whatever"
          exact
          render={(props) => {
            return (
              <Whatever
                {...props}
                auth={this.props.auth}
                updateWhatever={this.updateWhatever}
              />
            )
          }}
        />

        <Route
          path="/whatever/:whateverId/attach"
          exact
          render={(props) => {
            return <AttachToWhatever {...props} auth={this.props.auth} />
          }}
        />
      </Switch>
    )
  }
}
