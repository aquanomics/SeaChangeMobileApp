import React, { Component } from 'react';
import { Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

export default class ResizedImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0
    };
  }

  componentDidMount() {
    Image.getSize(
      this.props.source.uri,
      (srcWidth, srcHeight) => {
        console.log("Image size")
        console.log(srcWidth);
        console.log(srcHeight);
        let ratio = 1.0;
        if (srcWidth != 0 && srcHeight != 0){
          ratio = Math.min((width - this.props.margin) / srcWidth, height / srcHeight);
        }

        this.setState({ height: srcHeight * ratio });
      },
      error => console.log(error)
    );
  }

  componentWillUnmount() {
    this.setState({ height: 0 });
  }

  render() {
    const { source } = this.props;
    return (
      <Image
        source={{ uri: source.uri }}
        style={{
        		width: width * 0.9,
          height: this.state.height,
          borderRadius: 15,
        }}
        resizeMode="cover"
      />
    );
  }
}
