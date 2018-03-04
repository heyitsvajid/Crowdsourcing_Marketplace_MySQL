import React, { Component } from 'react';
import axios, { post } from 'axios';

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: '',
      successMessage: '',
      errorMessage: '',
    };
    this._handleImageChange = this._handleImageChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentWillMount() {
    debugger
    let getprofileImageAPI = 'http://localhost:3001/getProfileImage';
    let id = localStorage.getItem('id');
    if (id) {
      var apiPayload = {
        id: id
      }
      axios.post(getprofileImageAPI, apiPayload)
        .then(res => {
          debugger
          //console.log(res.data);
          let reader = new FileReader();
          let file = res.data;
      
          reader.onloadend = () => {
            this.setState({
              file: file,
              imagePreviewUrl: reader.result
            });
          }
          reader.readAsDataURL(file)
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
  renderRows() {
    if (this.state.errorMessage != '') {
      return (
        <p class="text-danger" >{this.state.errorMessage}</p>
      );
    } else if (this.state.successMessage != '') {
      return (
        <p class="alert alert-success" >{this.state.errorMessage}</p>
      );
    }
  }
  _handleSubmit(e) {
    e.preventDefault();
    debugger;
    // TODO: do something with -> this.state.file
    let uploadAPI = 'http://localhost:3001/uploadImage';
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('id', 1);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    post(uploadAPI, formData, config).then(function (res) {
      if (res.data.errorMsg != '') {
        alert(res.data.errorMsg);
      } else if (res.data.successMsg != '') {
        alert(res.data.successMsg);
      }
    });
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img alt="" class="avatar img-circle" src={imagePreviewUrl} width='200px' height='200px' />);
    } else {
      $imagePreview = <img alt="" src="http://www.investeqcapital.com/images/tlpteam/no-image.png" class="avatar img-circle" width='200px' height='200px' />
    }

    return (
      <div>
        <form onSubmit={this._handleSubmit}>
          {$imagePreview}
          <input class='form-control mt-3' type="file" onChange={this._handleImageChange} /><br />
          <h6 class='mt-2'>Upload a different photo...</h6>
          <button type="button" class="btn btn-primary mt-2" value="Upload Image" onClick={this._handleSubmit}>Upload Image</button>
        </form>
      </div>
    )
  }

}

export default ImageUpload;