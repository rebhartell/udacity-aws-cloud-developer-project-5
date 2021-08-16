import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Loader
} from 'semantic-ui-react'
import {
  createWhatever,
  deleteWhatever, getAllWhateverByCategory
} from '../api/whatever-api'
import Auth from '../auth/Auth'
import { CategoryItem } from '../types/CategoryItem'
import { WhateverItem } from '../types/WhateverItem'

interface WhateverProps {
  match: {
    params: {
      categoryId: string
    }
  }
  auth: Auth
  history: History
  updateWhatever: (id: string, name: string) => void
}

interface WhateverState {
  category: CategoryItem
  whatever: WhateverItem[]
  newWhateverName: string
  loadingWhatever: boolean
}

export class Whatever extends React.PureComponent<
  WhateverProps,
  WhateverState
> {
  state: WhateverState = {
    category: { 
      itemId: this.props.match.params.categoryId,
      name: '', 
      jsonSchema: '',
      uiSchema: '',
      createdAt: ''
    },
    whatever: [],
    newWhateverName: '',
    loadingWhatever: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newWhateverName: event.target.value })
  }

  onAddAttachmentButtonClick = (itemId: string) => {
    this.props.history.push(`/whatever/${itemId}/attach`)
  }

  onEditButtonClick = (itemId: string) => {
    this.props.history.push(`/category/${this.state.category.itemId}/whatever/${itemId}/edit`)
  }

  onWhateverCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newWhatever = await createWhatever(this.props.auth.getIdToken(), {
        name: this.state.newWhateverName,
        categoryId: this.state.category.itemId
      })

      this.setState({
        whatever: [...this.state.whatever, newWhatever],
        newWhateverName: ''
      })

      this.props.updateWhatever(`${newWhatever.itemId}`, `${newWhatever.name}`)

    } catch {
      alert('Whatever creation failed')
    }
  }

  onWhateverDelete = async (itemId: string) => {
    try {
      await deleteWhatever(this.props.auth.getIdToken(), itemId)
      this.setState({
        whatever: this.state.whatever.filter(
          (whatever) => whatever.itemId !== itemId
        )
      })
    } catch {
      alert('Whatever deletion failed')
    }
  }


  async componentDidMount() {
    try {
      const whatever = await getAllWhateverByCategory(this.props.auth.getIdToken(), this.state.category.itemId)
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
              <Grid.Column width={3} verticalAlign="middle">
                {whatever.attachmentUrl && (
                  <Image src={whatever.attachmentUrl} size="small" wrapped />
                )}
              </Grid.Column>

              <Grid.Column width={10} verticalAlign="middle">
                {whatever.name}
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
                  color="green"
                  onClick={() => this.onAddAttachmentButtonClick(whatever.itemId)}
                >
                  <Icon name="image" />
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

              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

}
