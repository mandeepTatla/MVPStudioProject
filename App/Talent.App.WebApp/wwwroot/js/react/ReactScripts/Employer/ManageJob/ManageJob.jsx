import React from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import LoggedInBanner from "../../Layout/Banner/LoggedInBanner.jsx";
import { LoggedInNavigation } from "../../Layout/LoggedInNavigation.jsx";
import { JobSummaryCard } from "./JobSummaryCard.jsx";
import { BodyWrapper, loaderData } from "../../Layout/BodyWrapper.jsx";
import { jobCategories } from "../common.js";

import {
    Card,
    Button,
    Label,
    CardGroup,
    Pagination,
    Icon,
    Dropdown,
    Checkbox,
    Accordion,
    Form,
    Segment,
    Header,
} from "semantic-ui-react";

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData;
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        console.log("Loader : " + loader);

        this.state = {
            job_List: [],
            loadJobs: [
                {
                    title: "",
                    summary: "",
                    location: { country: "", city: "" },
                },
            ],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc",
            },

            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true,
            },
            totalPages: 1,
            activeIndex: "",
        };

        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);

        //your functions go here
        this.EmployerJobList = this.EmployerJobList.bind(this);
    }

    EmployerJobList(jobs) {
        console.log("Im here in the employer function ");
        // this.setState({ job_List: jobs });
        this.state.job_List = jobs;
    }
    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData);
        this.setState({ loaderData }); //comment this
        //set loaderData.isLoading to false after getting data

        this.loadData(() => this.setState({ loaderData }));
        loaderData.isLoading = false;
        console.log(this.state.loaderData);
    }

    componentDidMount() {
        this.init();
        //this.EmployerJobList();
    }

    loadData(callback) {

        var link = 'https://talentservicestalent01.azurewebsites.net/listing/listing/getSortedEmployerJobs';

        var cookies = Cookies.get("talentAuthToken");
        // your ajax call and other logic goes here

        $.ajax({
            url: link,
            headers: {
                Authorization: "Bearer " + cookies,
                "Content-Type": "application/json",
            },
            type: "GET",
            dataType: "json",

            data: {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired,
            },

            success: function (data) {
                let jobs = data.myJobs;
                console.log(data);
                console.log("success ", data, "X: ", jobs);
                if (jobs != null) {
                    this.state.loadJobs = jobs;
                    //EmployerJobList(jobs);
                }
                callback();
            }.bind(this),

            error: function (errorThrown) {
                console.log("error: ", errorThrown);
            },
        });
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader,
                });
            });
        });
    }

    render() {
        let job_List = this.state.loadJobs;
        let jobCard = [];
        if (job_List != null) {
            jobCard = job_List.map((item, index) => (
                <Card key={index}>
                    <Card.Content>
                        <Card.Header>{item.title}</Card.Header>
                        <a className="ui black right ribbon label">
                            <i className="user icon"></i>
                        </a>
                        <Card.Meta>
                            {item.location.city},{item.location.country}
                        </Card.Meta>
                        <Card.Description>{item.summary}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button color="red" floated="left" size="mini">
                            Expired
            </Button>
                        <Button.Group floated="right" size="mini">
                            <Button className="ui blue basic">
                                <Icon name="ban" />
                Close
              </Button>
                            <Button className="ui blue basic">
                                <Icon name="edit" />
                Edit
              </Button>
                            <Button className="ui blue basic">
                                <Icon name="copy" />
                Copy
              </Button>
                        </Button.Group>
                    </Card.Content>
                </Card>
            ));
        }

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui container">
                            <Header as="h1">List of Jobs</Header>
                            <Icon name="filter" /> Filter:
              <Dropdown text=" Choose Filter" labeled search />
                            <Icon name="calendar alternate outline" /> Sort by date:
              <Dropdown text=" Newest First" labeled search />
                            <br />
                            <br />

                            <div className="ui cards">{jobCard}</div>
                            <div align="center">
                                <Pagination
                                    defaultActivePage={1}
                                    firstItem={{
                                        content: <Icon name="angle double left" />,
                                        icon: true,
                                    }}
                                    lastItem={{
                                        content: <Icon name="angle double right" />,
                                        icon: true,
                                    }}
                                    prevItem={{ content: <Icon name="angle left" />, icon: true }}
                                    nextItem={{
                                        content: <Icon name="angle right" />,
                                        icon: true,
                                    }}
                                    totalPages={1}

                                />
                            </div>
                        </div>
                    </div>
                </section>
            </BodyWrapper>
        );
    }
}