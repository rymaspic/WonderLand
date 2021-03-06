import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import { Gallery } from './Gallery';
import {
  GEOLOCATION_OPTIONS,
  POSITION_KEY,
  TOKEN_KEY,
  API_ROOT,
  AUTH_HEADER,
} from '../constants';
import '../styles/Home.css';

const { TabPane } = Tabs;

export class Home extends React.Component {
  state = {
    loadingGeolocation: false,
    loadingPosts: false,
    errorMessage: null,
    posts: [],
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
    this.loadNearbyPost();
  }

  onGeolocationFailure = () => {
    this.setState({
      loadingGeolocation: false,
      error: 'Failed to load geolocation.',
    })
  }

  loadNearbyPost(
    position = JSON.parse(localStorage.getItem(POSITION_KEY)),
    range = 20,
  ) {
    this.setState({
      loadingPosts: true,
      error: null,
    });
    const token = localStorage.getItem(TOKEN_KEY);
    fetch(`${API_ROOT}/search?lat=${position.latitude}&lon=${position.longitude}&range=${range}`, {
      method: 'GET',
      headers: {
        Authorization: `${AUTH_HEADER} ${token}`,
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Failed to load posts.');
    }).then((data) => {
      console.log(data);
      this.setState({
        loadingPosts: false,
        posts: data ? data : [],
      });
    }).catch((error) => {
      this.setState({
        loadingPosts: false,
        error: error.message,
      });
    });
  }

  getImagePosts() {
    if (this.state.error) {
      return <div>{this.state.error}</div>
    } else if(this.state.loadingGeolocation) {
      return <Spin tip="Loading geolocation..."/>
    } else if (this.state.loadingPosts) {
      return <Spin tip="Loading posts..." />
    } else if (this.state.posts.length > 0) {
      const images = this.state.posts.map((post) => {
        return {
          user: post.user,
          src: post.url,
          thumbnail: post.url,
          caption: post.message,
          thumbnailWidth: 400,
          thumbnailHeight: 300,
        }
      });

      return (<Gallery images={images}/>);
    } else {
      return 'No nearby posts.';
    }
  }

  componentDidMount() {
    this.getGeolocation();
  }

  render() {
    const operations = <Button>Create New Post</Button>;
    return (
      <Tabs tabBarExtraContent={operations} className="main-tabs">
        <TabPane tab="Image Posts" key="1">
          {this.getImagePosts()}
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
