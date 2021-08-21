import * as React from 'react'
import { Button, Header, SemanticCOLORS } from 'semantic-ui-react'
import Auth from '../auth/Auth'

// "red" | "orange" | "yellow" | "olive" | "green" | "teal" | "blue" | "violet" | "purple" | "pink" | "brown" | "grey" | "black"
const LOGIN_BUTTON_COLOR: SemanticCOLORS = "green"

const TEXT_COLOR: SemanticCOLORS = "black"


interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <Header as="h1" color={TEXT_COLOR} >Please log in</Header>

        <Button onClick={this.onLogin} size="huge" color={LOGIN_BUTTON_COLOR}>
          Log in
        </Button>
      </div>
    )
  }
}
