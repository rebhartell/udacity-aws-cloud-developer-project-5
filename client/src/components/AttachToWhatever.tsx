import * as React from 'react'
import { Button, Form } from 'semantic-ui-react'
import { getUploadUrl, uploadFile } from '../api/whatever-api'
import Auth from '../auth/Auth'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface AttachToWhateverProps {
  match: {
    params: {
      whateverId: string
    }
  }
  auth: Auth
}

interface AttachToWhateverState {
  file: any
  uploadState: UploadState
}

export class AttachToWhatever extends React.PureComponent<
  AttachToWhateverProps,
  AttachToWhateverState
> {
  state: AttachToWhateverState = {
    file: undefined,
    uploadState: UploadState.NoUpload
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File must be selected first')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.whateverId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      // alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload specified file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
