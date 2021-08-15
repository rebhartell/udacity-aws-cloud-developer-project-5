import * as React from 'react'
import { Form, Grid, Header, Loader } from 'semantic-ui-react'
import { getCategory, patchCategory } from '../api/category-api'
import Auth from '../auth/Auth'
import { CategoryItem } from '../types/CategoryItem'

interface EditCategoryProps {
  match: {
    params: {
      itemId: string
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
      itemId: this.props.match.params.itemId,
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
        this.props.match.params.itemId
      )
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
      if (!this.state.category.name) {
        alert('Name should be specified')
        return
      }

      this.setState({ isSaving: true })

      await patchCategory(
        this.props.auth.getIdToken(),
        this.props.match.params.itemId,
        this.state.category
      )

      alert('Category was uploaded!')
    } catch (e) {
      alert('Could not upload Category: ' + e.message)
    } finally {
      this.setState({ isSaving: false })
    }

    console.log(`handleSubmit: ${JSON.stringify(this.state)}`)
  }

  
  // handlePrettyClick = () => {
  //   let ugly = this.state.category.jsonSchema
  //   let obj = JSON.parse(ugly)
  //   let pretty = JSON.stringify(obj, undefined, 4)

  //   this.setState((prevState) => ({
  //     category: {
  //       ...prevState.category,
  //       jsonSchema: pretty
  //     }
  //   }))

  //   ugly = this.state.category.uiSchema
  //   obj = JSON.parse(ugly)
  //   pretty = JSON.stringify(obj, undefined, 4)

  //   this.setState((prevState) => ({
  //     category: {
  //       ...prevState.category,
  //       uiSchema: pretty
  //     }
  //   }))
  // }


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
          placeholder="UI Schema defining data entry for items of this Category"
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

        {/* <Button
          loading={this.state.isSaving}
          onClick={this.handlePrettyClick}
        >
          Pretty JSON
        </Button> */}
      </div>
    )
  }
}
