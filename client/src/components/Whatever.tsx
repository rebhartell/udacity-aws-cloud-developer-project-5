import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon, Image, Input, Loader
} from 'semantic-ui-react'
import { createWhatever, deleteWhatever, getAllWhatever, patchWhatever } from '../api/whatever-api'
import Auth from '../auth/Auth'
import { WhateverItem } from '../types/WhateverItem'


interface WhateverProps {
  auth: Auth
  history: History
}

interface WhateverState {
  whatever: WhateverItem[]
  newWhateverName: string
  loadingWhatever: boolean
}

export class Whatever extends React.PureComponent<WhateverProps, WhateverState> {
  state: WhateverState = {
    whatever: [],
    newWhateverName: '',
    loadingWhatever: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newWhateverName: event.target.value })
  }

  onEditButtonClick = (itemId: string) => {
    this.props.history.push(`/whatever/${itemId}/edit`)
  }

  onWhateverCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newWhatever = await createWhatever(this.props.auth.getIdToken(), {
        name: this.state.newWhateverName,
        dueDate
      })
      this.setState({
        whatever: [...this.state.whatever, newWhatever],
        newWhateverName: ''
      })
    } catch {
      alert('Whatever creation failed')
    }
  }

  onWhateverDelete = async (itemId: string) => {
    try {
      await deleteWhatever(this.props.auth.getIdToken(), itemId)
      this.setState({
        whatever: this.state.whatever.filter(whatever => whatever.itemId !== itemId)
      })
    } catch {
      alert('Whatever deletion failed')
    }
  }

  onWhateverCheck = async (pos: number) => {
    try {
      const whatever = this.state.whatever[pos]
      await patchWhatever(this.props.auth.getIdToken(), whatever.itemId, {
        name: whatever.name,
        dueDate: whatever.dueDate,
        done: !whatever.done
      })
      this.setState({
        whatever: update(this.state.whatever, {
          [pos]: { done: { $set: !whatever.done } }
        })
      })
    } catch {
      alert('Whatever toggle done failed')
    }
  }

  async componentDidMount() {
    try {
      const whatever = await getAllWhatever(this.props.auth.getIdToken())
      this.setState({
        whatever,
        loadingWhatever: false
      })
    } catch (e) {
      alert(`Failed to fetch all whatever: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Items</Header>

        {this.renderCreateWhateverInput()}

        {this.renderWhatever()}
      </div>
    )
  }

  renderCreateWhateverInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onWhateverCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderWhatever() {
    if (this.state.loadingWhatever) {
      return this.renderLoading()
    }

    return this.renderWhateverList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Items
        </Loader>
      </Grid.Row>
    )
  }

  renderWhateverList() {
    return (
      <Grid padded>
        {this.state.whatever.map((whatever, pos) => {
          return (
            <Grid.Row key={whatever.itemId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onWhateverCheck(pos)}
                  checked={whatever.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {whatever.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {whatever.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(whatever.itemId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onWhateverDelete(whatever.itemId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {whatever.attachmentUrl && (
                <Image src={whatever.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
