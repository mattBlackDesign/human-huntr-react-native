
import React, { Component } from 'react';
import { Image, View, TouchableOpacity,Platform, RefreshControl, ListView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Content, Text, Button, Icon, List,Card,CardItem, ListItem, Spinner} from 'native-base';

import { Grid, Col, Row } from 'react-native-easy-grid';
import Swiper from 'react-native-swiper';
import { openDrawer } from '../../actions/drawer';

import theme from '../../themes/base-theme';
import styles from './styles';

const {
  reset,
  pushRoute,
  popRoute
} = actions;

const signUp = require('../../../images/BG-signUp.png');
const headerLogo = require('../../../images/Header-Logo.png');

const bg = require('../../../images/BG.png');


class Join extends Component {

    static propTypes = {
      openDrawer: React.PropTypes.func,
      reset: React.PropTypes.func,
      pushRoute: React.PropTypes.func,
      navigation: React.PropTypes.shape({
        key: React.PropTypes.string,
      }),
    }

    constructor(props) {
      super(props);
      this.state = {
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2
        }),
        loaded: false,
        isRefreshing: false,
        modalVisible: false,
        page: 1,
        items: [],
      }
    }

    componentDidMount() {
      this._loadInitialState().done();

    }

    popRoute() {
      this.props.popRoute(this.props.navigation.key);
    }


    async _loadInitialState() {
      try {
        // const authToken = await AsyncStorage.getItem('authToken');
        // if (authToken == null) {
        //   Alert.alert('Error with login details. Try logging in again.',
        //     [{text: 'Back', onPress: () => {this.pushNewRoute('login')}},]
        //   );
        // }

        // this.setState({authToken: authToken});
        this._fetchData();
      } catch (error) {
        Alert.alert('Error',error.text + ' Redirecting to Dashboard',
          [{text: 'Back', onPress: () => {this.pushRoute('home')}},]
        );
      }
    }

    _fetchData() {
      var items = this.state.items;
      console.log('state organization id is ' + this.state.organizationID)
      fetch('http://159.203.36.118/api/v1/games.json?auth_token=2u3sXf_vs2_ZFEbmbzaW')
      .then((response) => response.json())
      .then((responseData) => {

        console.log('response Data');
        console.log(responseData);

        for (var i=0; i < responseData.data.games.length; i++) {
            items.push(responseData.data.games[i]);
        }

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(items),
          loaded: true,
          isRefreshing: false,
          page: this.state.page + 1,
          data: [],
        });
      })
      .done();
    }

    pushRoute(route) {
      this.props.pushRoute({ key: route, index: 1 }, this.props.navigation.key);
    }

    render() {
        if(!this.state.loaded) {
          return(


                <Content style={{backgroundColor: 'transparent'}}>
                  <Spinner color="white"/>
                </Content>

          )
        }

        return (

          <Container theme={theme}>
            <Image source={bg} style={styles.container} >
                <Image source={require('../../../images/glow2.png')} style={styles.container} >
                <Header>
                  <View style={styles.header} >
                    <View style={styles.rowHeader}>
                      <Button
                        transparent
                        style={styles.btnHeader}
                        onPress={() => this.popRoute()}
                      >
                        <Icon name="ios-arrow-back" style={{lineHeight: 30}} />
                      </Button>

                    </View>
                  </View>
                </Header>


                <Content scrollEnabled={false} >

                  <View style={Platform.OS === 'android' ? styles.aviewArea : styles.viewArea }>



                    <ListView
                      dataSource={this.state.dataSource}
                      renderRow={this.renderItem.bind(this)}
                      style={styles.listView}
                      onEndReached={this._fetchData.bind(this)}
                      removeClippedSubviews={true}
                      // renderSectionHeader={this.renderSectionHeader.bind(this)}
                      onEndReachedThreshold={1200}
                      refreshControl={
                        <RefreshControl
                          refreshing={this.state.isRefreshing}
                          tintColor="#000"
                          title=" "
                          titleColor="#000"
                          colors={['#01cca1', '#00ff00', '#0000ff']}
                          progressBackgroundColor="rgba(0,0,0,0)"
                        />
                      }
                    />



                   </View>
                </Content>

              </Image>
              </Image>
            </Container>

        )
    }

    renderItem(item) {
      return (
          <View style={{borderColor: '#fff', borderBottomWidth: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}>
            <TouchableOpacity onPress={() => this.pushRoute('game')}>
            <Text style={{color: '#fff', padding: 10, fontSize: 17}}>{item.name} <Icon name="ios-person" style={{fontSize: 20, marginLeft: 10}} /> 4</Text>
            </TouchableOpacity>
          </View>


        )
    }
}


function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    reset: key => dispatch(reset([{ key: 'login' }], key, 0)),
    pushRoute: (route, key) => dispatch(pushRoute(route, key)),
    popRoute: key => dispatch(popRoute(key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(Join);
