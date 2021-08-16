import * as React from 'react'
import { Form, Grid, Header, Loader } from 'semantic-ui-react'
import { getCategory } from '../api/category-api'
import { getWhatever, patchWhatever } from '../api/whatever-api'
import Auth from '../auth/Auth'
import { CategoryItem } from '../types/CategoryItem'
import { WhateverItem } from '../types/WhateverItem'

interface EditWhateverProps {
  match: {
    params: {
      categoryId: string
      whateverId: string
    }
  }
  auth: Auth
}

interface EditWhateverState {
  isLoading: boolean
  isSaving: boolean
  category: CategoryItem
  whatever: WhateverItem
  formDataJson: string
}

export class EditWhatever extends React.PureComponent<
  EditWhateverProps,
  EditWhateverState
> {
  state: EditWhateverState = {
    isLoading: true,
    isSaving: false,
    category: {
      itemId: this.props.match.params.categoryId,
      name: '',
      jsonSchema: '',
      uiSchema: '',
      createdAt: ''
    },
    whatever: {
      itemId: this.props.match.params.whateverId,
      name: '',
      categoryId: '',
      formData: {},
      attachmentUrl: '',
      createdAt: ''
    },
    formDataJson: ''
  }

  prettyPrint = (ugly: string): string => {
    const obj = JSON.parse(ugly)
    return JSON.stringify(obj, undefined, 4)
  }

  prettyPrintIgnoreErrors = (ugly: string): string => {
    try {
      return this.prettyPrint(ugly)
    } catch (error) {
      // ignore
    }

    return ugly
  }

  prettyPrintObjectIgnoreErrors = (ugly: object): string => {
    try {
      return JSON.stringify(ugly, undefined, 4)
    } catch (error) {
      // ignore
    }

    return ""
  }

  async componentDidMount() {

    try {
      const category = await getCategory(
        this.props.auth.getIdToken(),
        this.props.match.params.categoryId
      )

      category.jsonSchema = this.prettyPrintIgnoreErrors(category.jsonSchema)

      category.uiSchema = this.prettyPrintIgnoreErrors(category.uiSchema)

      this.setState({
        category
      })

    } catch (e) {
      alert(`Failed to fetch category: ${e.message}`)
    }

    try {
      const whatever = await getWhatever(
        this.props.auth.getIdToken(),
        this.props.match.params.whateverId
      )

      this.setState({
        whatever,
        formDataJson: this.prettyPrintObjectIgnoreErrors(whatever.formData)
      })

    } catch (e) {
      alert(`Failed to fetch whatever: ${e.message}`)
    }

    this.setState({
      isLoading: false
    })
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
      let whatever = this.state.whatever

      try {
        whatever.formData = JSON.parse(this.state.formDataJson)
      } catch (error) {
        alert('formData Schema has errors')
        return
      }


      this.setState({
        isSaving: true,
        whatever: whatever
      })

     
      await patchWhatever(
        this.props.auth.getIdToken(),
        this.props.match.params.whateverId,
        this.state.whatever
      )

      alert('Whatever was updated!')
    } catch (e) {
      alert('Could not upload Whatever: ' + e.message)
    } finally {
      this.setState({ isSaving: false })
    }

    console.log(`handleSubmit: ${JSON.stringify(this.state)}`)
  }

  render() {
    return (
      <div>
        <Header as="h1">Edit Whatever</Header>

        {this.renderWhatever()}
      </div>
    )
  }

  renderWhatever() {
    if (this.state.isLoading) {
      return this.renderLoading()
    }

    return this.renderWhateverItem()
  }

  renderLoading() {
    return (
      <Grid>
        <Grid.Row>
          <Loader indeterminate active inline="centered">
            Loading Whatever Item
          </Loader>
        </Grid.Row>
      </Grid>
    )
  }

  renderWhateverItem() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.TextArea
          rows={10}
          label="Form Data"
          name="formData"
          value={this.state.formDataJson}
          placeholder="Form Data is the data model this Whatever item"
          onChange={this.handleTextAreaChange}
        />

        <Form.TextArea
          rows={10}
          label="JSON Schema"
          name="jsonSchema"
          value={this.state.category.jsonSchema}
          placeholder="JSON Schema defining data model for items of this Whatever"
          onChange={this.handleTextAreaChange}
        />

        <Form.TextArea
          rows={10}
          label="UI Schema"
          name="uiSchema"
          value={this.state.category.uiSchema}
          placeholder="UI Schema defining data entry for items of this Whatever"
          onChange={this.handleTextAreaChange}
        />

        {this.renderButton()}
      </Form>
    )
  }

  renderButton() {
    return (
      <div>
        {this.state.isSaving && <p>Saving Whatever</p>}

        <Form.Button loading={this.state.isSaving} type="submit">
          Save
        </Form.Button>
      </div>
    )
  }
}
