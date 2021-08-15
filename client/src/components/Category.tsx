import { History } from 'history'
import * as React from 'react'
import {
  Button, Divider,
  Grid,
  Header,
  Icon, Input, Loader
} from 'semantic-ui-react'
import { createCategory, deleteCategory, getAllCategory } from '../api/category-api'
// import { createCategory, deleteCategory, getAllCategory, patchCategory } from '../api/category-api'
import Auth from '../auth/Auth'
import { CategoryItem } from '../types/CategoryItem'
// import { CategoryItem } from '../types/CategoryItem'


interface CategoryProps {
  auth: Auth
  history: History
}

interface CategoryState {
  category: CategoryItem[]
  newCategoryName: string
  loadingCategory: boolean
}

export class Category extends React.PureComponent<CategoryProps, CategoryState> {
  state: CategoryState = {
    category: [],
    newCategoryName: '',
    loadingCategory: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCategoryName: event.target.value })
  }

  onEditButtonClick = (itemId: string) => {
    this.props.history.push(`/category/${itemId}/edit`)
  }

  onCategoryCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const category: CategoryItem = {
        itemId: "",
        name: this.state.newCategoryName,
        jsonSchema: "",
        uiSchema: "",
        createdAt: ""
      }

      const newCategory = await createCategory(this.props.auth.getIdToken(), category)
      this.setState({
        category: [...this.state.category, newCategory],
        newCategoryName: ''
      })
    } catch {
      alert('Category creation failed')
    }
  }

  onCategoryDelete = async (itemId: string) => {
    try {
      await deleteCategory(this.props.auth.getIdToken(), itemId)
      this.setState({
        category: this.state.category.filter(category => category.itemId !== itemId)
      })
    } catch {
      alert('Category deletion failed')
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
      alert(`Failed to fetch category: ${e.message}`)
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
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onCategoryCreate
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
              <Grid.Column width={10} verticalAlign="middle">
                {category.name}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(category.itemId)}
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
