import * as React from 'react'
import { Grid, Header, Loader, Segment } from 'semantic-ui-react'
import { getCategory } from '../api/category-api'
import { getWhatever, patchWhatever } from '../api/whatever-api'
import Auth from '../auth/Auth'
import { CategoryItem } from '../types/CategoryItem'
import { UpdateWhateverRequest } from '../types/UpdateWhateverRequest'
import { WhateverItem } from '../types/WhateverItem'
import RjsForm from './RjsForm'

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
    }
  }

  async componentDidMount() {
    try {
      const category = await getCategory(
        this.props.auth.getIdToken(),
        this.props.match.params.categoryId
      )

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
        whatever
      })
    } catch (e) {
      alert(`Failed to fetch whatever: ${e.message}`)
    }

    this.setState({
      isLoading: false
    })
  }

  handleRjsFormSubmit = async (formData: any) => {
    this.setState({
      isSaving: true,
      whatever: {
        ...this.state.whatever,

        formData: formData
      }
    })

    const updatedWhatever: UpdateWhateverRequest = {
      name: this.state.whatever.name,
      categoryId: this.state.whatever.categoryId,
      formData: formData      
    }

    try {
      await patchWhatever(
        this.props.auth.getIdToken(),
        this.props.match.params.whateverId,
        updatedWhatever
      )

      alert(`Item updated: ${this.state.whatever.name}`)
    } catch (e) {
      alert(`Could not update Item: ${this.state.whatever.name}\n ${e.message}`)
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

    if (this.state.isSaving) {
      return this.renderSaving()
    }

    return this.renderWhateverItem()
  }

  renderSaving() {
    return (
      <Grid>
        <Grid.Row>
          <Loader indeterminate active inline="centered">
            Saving Whatever Item
          </Loader>
        </Grid.Row>
      </Grid>
    )
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
      <Segment>
        <RjsForm
          schema={this.state.category.jsonSchema}
          uiSchema={this.state.category.uiSchema}
          formData={this.state.whatever.formData}
          handleRjsFormSubmit={this.handleRjsFormSubmit}
        />
      </Segment>
    )
  }
}
