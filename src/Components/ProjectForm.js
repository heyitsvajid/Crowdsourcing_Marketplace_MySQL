import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { post } from 'axios';
import { Link } from 'react-router-dom';

class ProjectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      successMessage: '',
      errorMessage: '',
      title: '',
      description: '',
      skill: '',
      budget: '',
      period: '',
    }
    this._handleChangeFile = this._handleChangeFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value })

  }
  handleSubmit(e) {
    e.preventDefault();
    let postProjectAPI = 'http://localhost:3001/postProject';
  debugger;
    let title = this.state.title.trim();
    let description = this.state.description;
    let skill = this.state.skill;
    let budget = this.state.budget;
    let period = this.state.period;
    let id = localStorage.getItem('id');

    if (!title || !description || !budget || !skill || !period) {
      alert('Please complete the form.');
      return;
    }
   
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('id', id);
    formData.append('title', title);
    formData.append('description',description);
    formData.append('skill', skill);
    formData.append('budget', budget);
    formData.append('period', period);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    post(postProjectAPI, formData, config).then(function (res) {
      if (res.data.errorMsg != '') {
         // eslint-disable-next-line 
        if (confirm(res.data.errorMsg)) {
          this.props.history.push('/home');
      }
      }else if (res.data.successMsg != '') {
        // eslint-disable-next-line
       if (confirm(res.data.successMsg)) {
          this.props.history.push('/home');
          this.setState({
            file: '',
            successMessage: '',
            errorMessage: '',
            title: '',
            description: '',
            skill: '',
            budget: '',
            period: '',
          });
      }
      }
    });
  }
  _handleChangeFile(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
      });
    }

    reader.readAsDataURL(file)
  }
  render() {
    return (
      <div>
        <div class="container">
          <hr />
          <div class="row">

            <div class="col-md-9 personal-info">
            
              <h3>Project Info</h3>

              <form class="form-horizontal">
                <div class="form-group">
                  <label class="col-lg-3 control-label">Title</label>
                  <div class="col-lg-8">
                    <input class="form-control" type="text"  name="title"
                      placeholder="Title" required="" value={this.state.title} onChange={this.handleUserInput} />
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-md-3 control-label">Description</label>
                  <div class="col-md-8">
                    <textarea class="form-control" rows="5"  name="description"
                      placeholder="Description" required="" value={this.state.description} onChange={this.handleUserInput}></textarea>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-lg-3 control-label">Main Skill</label>
                  <div class="col-lg-8">
                    <input class="form-control" type="text" name="skill"
                      placeholder="Skill" required="" value={this.state.skill} onChange={this.handleUserInput} />
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-lg-3 control-label">Budget Range</label>
                  <div class="col-lg-8">
                    <input class="form-control" type="text" name="budget"
                      placeholder="100-200" required="" value={this.state.budget} onChange={this.handleUserInput} />
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-lg-3 control-label">Budget Period</label>
                  <div class="col-lg-8">
                    <input class="form-control" type="text" name="period"
                      placeholder="Period in months" required="" value={this.state.period} onChange={this.handleUserInput} />
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-lg-3 control-label">Attachment</label>
                  <div class="col-lg-8">
                    <input type="file" class="form-control" onChange={this._handleChangeFile}/>            </div>
                </div>
                <div class="form-group">
                  <label class="col-md-3 control-label"></label>
                  <div class="col-md-8">
                    <input type="submit" class="btn btn-primary" 
                    value="Post Project" required="" onClick={this.handleSubmit.bind(this)}/>
                    <span></span>
                   <Link to='/home'> <input type="reset" class="btn btn-default" value="Cancel" /></Link>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
        <hr />

      </div>
    );
  }
}

export default withRouter(ProjectForm);