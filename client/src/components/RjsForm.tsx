import Form, { IChangeEvent } from '@rjsf/core'
import * as React from 'react'
import { IGNORE_ERRORS, jsonParse } from '../utils/JsonUtils'


interface RjsFormProps {
  schema: string
  uiSchema: string
  formData: object
  handleRjsFormSubmit: (formData: object) => void
}

export class RjsForm extends React.PureComponent<RjsFormProps> {
  
  onFormChange(event: IChangeEvent) {
    // console.log('changed', event)
  }

  onFormSubmit(event: IChangeEvent) {
    console.log('submit', event)
    this.props.handleRjsFormSubmit(event.formData)
  }

  onFormError(event: any) {
    // console.log('error', event)
  }

  render() {
    return (
      <Form
        schema={jsonParse(this.props.schema, IGNORE_ERRORS)}
        uiSchema={jsonParse(this.props.uiSchema, IGNORE_ERRORS)}
        formData={this.props.formData}
        onChange={(event) => this.onFormChange(event)}
        onSubmit={(event) => this.onFormSubmit(event)}
        onError={(event) => this.onFormError(event)}
      />
    )
  }
}

export default RjsForm
