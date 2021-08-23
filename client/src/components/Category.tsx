import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Loader,
  SemanticCOLORS
} from 'semantic-ui-react'
import {
  createCategory,
  deleteCategory,
  getAllCategory
} from '../api/category-api'
import Auth from '../auth/Auth'
import { CategoryItem } from '../types/CategoryItem'

// "red" | "orange" | "yellow" | "olive" | "green" | "teal" | "blue" | "violet" | "purple" | "pink" | "brown" | "grey" | "black"
const TEXT_COLOR: SemanticCOLORS = 'grey'

interface CategoryProps {
  auth: Auth
  history: History
  updateCategory: (id: string, name: string) => void
}

interface CategoryState {
  category: CategoryItem[]
  newCategoryName: string
  loadingCategory: boolean
}

export class Category extends React.PureComponent<
  CategoryProps,
  CategoryState
> {
  state: CategoryState = {
    category: [],
    newCategoryName: '',
    loadingCategory: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCategoryName: event.target.value })
  }

  onSelectButtonClick = (id: string, name: string) => {
    this.props.updateCategory(`${id}`, `${name}`)
    this.props.history.push(`/category/${id}/whatever`)
  }

  onEditButtonClick = (id: string, name: string) => {
    this.props.updateCategory(`${id}`, `${name}`)
    this.props.history.push(`/category/${id}/edit`)
  }

  onCategoryCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    if (this.state.newCategoryName === '') {
      alert('The new Category needs a name')
      return
    }

    const newName = this.state.newCategoryName

    try {
      const category: CategoryItem = {
        itemId: '',
        name: this.state.newCategoryName,
        jsonSchema: '',
        uiSchema: '',
        createdAt: ''
      }

      const newCategory = await createCategory(
        this.props.auth.getIdToken(),
        category
      )

      this.setState({
        category: [...this.state.category, newCategory],
        newCategoryName: ''
      })

      this.props.updateCategory('Not Selected', '')

      // alert(`New Category created: ${newName}`)
    } catch (e) {
      alert(`Failed to create Category: ${newName}\n${e.message}`)
    }
  }

  onCategoryDelete = async (itemId: string) => {
    const name = this.state.category.find(
      (category) => category.itemId === itemId
    )?.name

    try {
      await deleteCategory(this.props.auth.getIdToken(), itemId)

      this.setState({
        category: this.state.category.filter(
          (category) => category.itemId !== itemId
        )
      })

      this.props.updateCategory('Not Selected', '')

      // alert(`Category deleted: ${name}`)
    } catch (e) {
      alert(`Category deletion failed: ${name}\n${e.message}`)
    }
  }

  async componentDidMount() {
    try {
      const category = await getAllCategory(this.props.auth.getIdToken())
      this.setState({
        category,
        loadingCategory: false
      })
    } catch (e) {
      alert(`Failed to fetch all categories:\n${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Categories</Header>

        {this.renderCreateCategoryInput()}

        {this.renderCategory()}
      </div>
    )
  }

  renderCreateCategoryInput() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Input
              action={{
                color: 'teal',
                labelPosition: 'left',
                icon: 'add',
                content: 'Create Category',
                onClick: this.onCategoryCreate
              }}
              fluid
              actionPosition="left"
              placeholder="... for Whatever You Want"
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

  renderCategory() {
    if (this.state.loadingCategory) {
      return this.renderLoading()
    }

    return this.renderCategoryList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Categories
        </Loader>
      </Grid.Row>
    )
  }

  renderCategoryList() {
    return (
      <Grid padded>
        {this.state.category.map((category, pos) => {
          return (
            <Grid.Row key={category.itemId}>
              <Grid.Column width={13} verticalAlign="middle">
                <Header as="h3" color={TEXT_COLOR}>
                  {category.name}
                </Header>
              </Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="green"
                  onClick={() =>
                    this.onSelectButtonClick(category.itemId, category.name)
                  }
                >
                  <Icon name="target" />
                </Button>
              </Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() =>
                    this.onEditButtonClick(category.itemId, category.name)
                  }
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onCategoryDelete(category.itemId)}
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
