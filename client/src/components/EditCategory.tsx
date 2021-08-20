import * as React from 'react'
import { Form, Grid, Header, Loader } from 'semantic-ui-react'
import { getCategory, patchCategory } from '../api/category-api'
import Auth from '../auth/Auth'
import { CategoryItem } from '../types/CategoryItem'
import { IGNORE_ERRORS, prettyPrint } from '../utils/JsonUtils'

interface EditCategoryProps {
  match: {
    params: {
      categoryId: string
    }
  }
  auth: Auth
}

interface EditCategoryState {
  isLoading: boolean
  isSaving: boolean
  category: CategoryItem
}

export class EditCategory extends React.PureComponent<
  EditCategoryProps,
  EditCategoryState
> {
  state: EditCategoryState = {
    isLoading: true,
    isSaving: false,
    category: {
      itemId: this.props.match.params.categoryId,
      name: '',
      jsonSchema: '',
      uiSchema: '',
      createdAt: ''
    }
  }

  async componentDidMount() {
    try {
      const category = await getCategory(
        this.props.auth.getIdToken(),
        this.props.match.params.categoryId
      )

        category.jsonSchema = prettyPrint(category.jsonSchema, IGNORE_ERRORS)


        category.uiSchema = prettyPrint(category.uiSchema, IGNORE_ERRORS)

      this.setState({
        category,
        isLoading: false
      })
    } catch (e) {
      alert(`Failed to fetch category: ${e.message}`)
    }
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value

    if (name === 'name') {
      this.setState((prevState) => ({
        category: {
          ...prevState.category,
          name: value
        }
      }))
    }

    console.log(`handleInputChange: ${name}`)
    console.log(`handleInputChange: ${value}`)
  }

  handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = event.target.name
    const value = event.target.value

    if (name === 'jsonSchema') {
      this.setState((prevState) => ({
        category: {
          ...prevState.category,
          jsonSchema: value
        }
      }))
    } else if (name === 'uiSchema') {
      this.setState((prevState) => ({
        category: {
          ...prevState.category,
          uiSchema: value
        }
      }))
    }

    console.log(`handleTextAreaChange: ${name}`)
    console.log(`handleTextAreaChange: ${value}`)
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      let category = this.state.category

      if (!category.name) {
        alert('Name should be specified')
        return
      }

      try {
        category.jsonSchema = prettyPrint(category.jsonSchema)
      } catch (error) {
        alert('JSON Schema has errors')
        return
      }

      try {
        category.uiSchema = prettyPrint(category.uiSchema)
      } catch (error) {
        alert('UI Schema has errors')
        return
      }

      this.setState({
        isSaving: true,
        category: category
      })

      await patchCategory(
        this.props.auth.getIdToken(),
        this.props.match.params.categoryId,
        this.state.category
      )

      alert(`Category updated: ${this.state.category.name}`)
    } catch (e) {
      alert(`Could not update Category: ${this.state.category.name}\n ${e.message}`)
    } finally {
      this.setState({ isSaving: false })
    }

    console.log(`handleSubmit: ${JSON.stringify(this.state)}`)
  }


  render() {
    return (
      <div>
        <Header as="h1">Edit Category</Header>

        {this.renderCategory()}
      </div>
    )
  }

  renderCategory() {
    if (this.state.isLoading) {
      return this.renderLoading()
    }

    return this.renderCategoryItem()
  }

  renderLoading() {
    return (
      <Grid>
        <Grid.Row>
          <Loader indeterminate active inline="centered">
            Loading Category Item
          </Loader>
        </Grid.Row>
      </Grid>
    )
  }

  renderCategoryItem() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          fluid
          label="Name"
          name="name"
          value={this.state.category.name}
          placeholder="Category name"
          onChange={this.handleInputChange}
        />

        <Form.TextArea
          rows={10}
          label="JSON Schema"
          name="jsonSchema"
          value={this.state.category.jsonSchema}
          placeholder="JSON Schema defining data model for items of this Category"
          onChange={this.handleTextAreaChange}
        />

        <Form.TextArea
          rows={10}
          label="UI Schema"
          name="uiSchema"
          value={this.state.category.uiSchema}
          placeholder="UI Schema defining data entry for items of this Category"
          onChange={this.handleTextAreaChange}
        />

        {this.renderButton()}
      </Form>
    )
  }

  renderButton() {
    return (
      <div>
        
        {this.state.isSaving && <p>Saving Category</p>}

        <Form.Button loading={this.state.isSaving} type="submit">
          Save
        </Form.Button>

      </div>
    )
  }
}
