import React, { Component } from "react";
import {
  getServiceById,
  createService,
  getAllServices,
} from "../actions/servicesActions";
import classnames from "classnames";
import { connect } from "react-redux";
import { Dropdown } from "semantic-ui-react";

class UpdateService extends Component {
  constructor() {
    super();
    this.state = {
      serviceId: "",
      language: "",
      categoryId: "",
      subCategoryId: "",
      serviceName: "",
      shortDescription: "",
      aliases: "",
      imageUrl: "",
      websiteUrl: "",
      contact: "",
      responseMsg: "",

      errors: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getServiceById(id, this.props.history);
    this.props.getAllServices();
    console.log("component did mount");
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    const {
      serviceId,
      language,
      categoryId,
      subCategoryId,
      serviceName,
      shortDescription,
      aliases,
      imageUrl,
      websiteUrl,
      contact,
      responseMsg,
    } = nextProps.service;

    this.setState({
      serviceId,
      language,
      categoryId,
      subCategoryId,
      serviceName,
      shortDescription,
      aliases,
      imageUrl,
      websiteUrl,
      contact,
      responseMsg,
    });
    console.log(" componentWillReceiveProps");
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();
    console.log(e.target.name);
    const newService = {
      serviceId: this.state.serviceId,
      serviceName: this.state.serviceName,
      language: this.state.language,
      categoryId: this.state.categoryId,
      subCategoryId: null,
    };
    this.props.createService(newService, this.props.history);
  }
  fetchLanguageList() {
    const languageOptions = [
      { key: "en", value: "en", flag: "en", text: "English" },
      { key: "hi", value: "hi", flag: "hi", text: "Hindi" },
      { key: "pa", value: "pa", flag: "pa", text: "Punjabi" },
    ];
    return languageOptions;
  }
  fetchCategoryList() {
    const { categoryDtoList } = this.props.serviceList;

    if (categoryDtoList != undefined) {
      //  debugger;
      // console.log(categoryDtoList);
      var myCat = [];
      var obj = {};
      categoryDtoList.map((item) => {
        obj = {
          key: item.categoryId,
          value: item.categoryId,
          flag: item.categoryId,
          text: item.categoryName,
        };
        //   console.log(item.categoryId);
        // console.log(item.categoryName);
        myCat.push(obj);
      });
      //  console.log(categoryDtoList);
      return myCat;
    }
  }
  render() {
    const { errors } = this.state;

    return (
      <div>
        <div className="project">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h5 className="display-4 text-center">Update Department</h5>
                <hr />
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      className={classnames("form-control form-control-lg", {
                        "is-invalid": errors.serviceName,
                      })}
                      placeholder="Service Name"
                      name="serviceName"
                      value={this.state.serviceName}
                      onChange={this.onChange}
                    />
                    {errors.serviceName && (
                      <div className="invalid-feedback">
                        {errors.serviceName}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <Dropdown
                      placeholder="language"
                      fluid
                      multiple
                      search
                      selection
                      name="language"
                      onChange={this.handleOnChange}
                      options={this.fetchLanguageList()}
                      // value={this.state.language}
                    />

                    {errors.language && (
                      <div className="invalid-feedback">{errors.language}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <Dropdown
                      placeholder="category"
                      fluid
                      multiple
                      search
                      selection
                      name="categoryId"
                      onChange={this.handleOnChange}
                      options={this.fetchCategoryList()}
                      //value={this.state.categoryId}
                    />

                    {errors.language && (
                      <div className="invalid-feedback">{errors.language}</div>
                    )}
                  </div>
                  <input
                    type="submit"
                    className="btn btn-primary btn-block mt-4"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  service: state.service.service,
  errors: state.errors,
  serviceList: state.service.services,
});
export default connect(mapStateToProps, {
  getServiceById,
  createService,
  getAllServices,
})(UpdateService);
