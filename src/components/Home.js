import React from 'react';
import { Tabs, Button } from 'antd';
import { GEOLOCATION_OPTIONS, POSITION_KEY } from '../constants';
import '../styles/Home.css';

const { TabPane } = Tabs;

export class Home extends React.Component {
    state = {
        loadingGeolocation: false,
        errorMessage: null,
    }

    getGeolocation() {
        this.setState({
            loadingGeolocation: true,
            error: null,
        });
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onGeolocationSuccess,
                this.onGeolocationFailure,
                GEOLOCATION_OPTIONS,
            );
        } else {
            this.setState({
                loadingGeolocation: false,
                error: 'Your browser does not support geolocation.',
            });
        }
    }

    onGeolocationSuccess = (position) => {
        this.setState({
            loadingGeolocation: false,
            error: null,
        })
        console.log(position);
        const { latitude, longitude } = position.coords;
        localStorage.setItem(POSITION_KEY, JSON.stringify({ latitude, longitude }));
    }

    onGeolocationFailure = () => {
        this.setState({
            loadingGeolocation: false,
            error: 'Failed to load geolocation.',
        })
    }

    componentDidMount() {
        this.getGeolocation();
    }

    render() {
        const operations = <Button>Create New Post</Button>;
        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Tab 1" key="1">
                    Content of tab 1
                </TabPane>
                <TabPane tab="Tab 2" key="2">
                    Content of tab 2
                </TabPane>
                <TabPane tab="Tab 3" key="3">
                    Content of tab 3
                </TabPane>
            </Tabs>
        );
    }
};