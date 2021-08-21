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
  Loader,
  SemanticCOLORS
} from 'semantic-ui-react'
import {
  createWhatever,
  deleteWhatever,
  getAllWhateverByCategory
} from '../api/whatever-api'
import Auth from '../auth/Auth'
import { CategoryItem } from '../types/CategoryItem'
import { WhateverItem } from '../types/WhateverItem'

// "red" | "orange" | "yellow" | "olive" | "green" | "teal" | "blue" | "violet" | "purple" | "pink" | "brown" | "grey" | "black"
const TEXT_COLOR: SemanticCOLORS = 'grey'

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

  onAddAttachmentButtonClick = (id: string, name: string) => {
    this.props.updateWhatever(`${id}`, `${name}`)
    this.props.history.push(`/whatever/${id}/attach`)
  }

  onEditButtonClick = (id: string, name: string) => {
    this.props.updateWhatever(`${id}`, `${name}`)
    this.props.history.push(
      `/category/${this.state.category.itemId}/whatever/${id}/edit`
    )
  }

  onWhateverCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    if (this.state.newWhateverName === '') {
      alert('The new Item needs a name')
      return
    }

    try {
      const newName = this.state.newWhateverName

      const newWhatever = await createWhatever(this.props.auth.getIdToken(), {
        name: this.state.newWhateverName,
        categoryId: this.state.category.itemId
      })

      this.setState({
        whatever: [...this.state.whatever, newWhatever],
        newWhateverName: ''
      })

      this.props.updateWhatever('Not Selected', '')

      alert(`New Item created: ${newName}`)
    } catch (e) {
      alert(`Whatever creation failed\n${e.message}`)
    }
  }

  onWhateverDelete = async (itemId: string) => {
    const name = this.state.whatever.find(
      (whatever) => whatever.itemId === itemId
    )?.name

    try {
      await deleteWhatever(this.props.auth.getIdToken(), itemId)

      this.setState({
        whatever: this.state.whatever.filter(
          (whatever) => whatever.itemId !== itemId
        )
      })

      this.props.updateWhatever('Not Selected', '')

      alert(`Item deleted: ${name}`)
    } catch (e) {
      alert(`Item deletion failed: ${name}\n${e.message}`)
    }
  }

  async componentDidMount() {
    try {
      const whatever = await getAllWhateverByCategory(
        this.props.auth.getIdToken(),
        this.state.category.itemId
      )
      this.setState({
        whatever,
        loadingWhatever: false
      })
    } catch (e) {
      alert(`Failed to fetch all whatever:\n${e.message}`)
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
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Input
              action={{
                color: 'teal',
                labelPosition: 'left',
                icon: 'add',
                content: 'Create Item',
                onClick: this.onWhateverCreate
              }}
              fluid
              actionPosition="left"
              placeholder="To change the world..."
              onChange={this.handleNameChange}
            />
          </Grid.Column>
          <Grid.Column width={6}></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Divider />
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
                <Header as="h3" color={TEXT_COLOR}>
                  {whatever.name}
                </Header>
              </Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() =>
                    this.onEditButtonClick(whatever.itemId, whatever.name)
                  }
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="green"
                  onClick={() =>
                    this.onAddAttachmentButtonClick(
                      whatever.itemId,
                      whatever.name
                    )
                  }
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
