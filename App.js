import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, WebView, Picker} from 'react-native';
import {BTC_BITB, BTC_ARK, BTC_OMG, BTC_LTC, BTC_BAT, stMarketToIcon} from './config';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {externalDataRes:{}, stMarket: BTC_BITB}
    this.setMarket(this.state.stMarket)
    this.stMarketToIcon = stMarketToIcon
  }

  setMarket(stMarket) {
    fetch('https://bittrex.com/api/v1.1/public/getmarketsummary?market=' + stMarket).then(response => response.json())
    .then(response => {
      this.setState({externalDataRes: response, stMarket: stMarket}, function() {
      this.render()
    })}).catch((error) => {
      console.error(error);
    });
  }

  _onPressButton() {
    this.setMarket(this.state.stMarket)
  }

  componentDidMount() {
    this.setMarket(this.state.stMarket)
  }


  render() {
    function Market(props) {
      const pic = props.binder.stMarketToIcon[props.binder.state.stMarket]
      if (props.jsonMarket["success"]) {
        const res = props.jsonMarket["result"][0]
        return <TouchableOpacity onPress={props.binder._onPressButton.bind(props.binder)}>
               <View style={styles.button}>
               <Image source={pic}/>
               <Text>{res["MarketName"]}</Text>
               <Text>High: {res["High"]} Low: {res["Low"]}</Text>
               <Text>Volume: {res["Volume"]} Last: {res["Last"]}</Text>
               <Text>Open Buys: {res["OpenBuyOrders"]} Open Sells: {res["OpenSellOrders"]}</Text>
               </View>
               </TouchableOpacity>
      } else {
        return <TouchableOpacity onPress={props.binder._onPressButton.bind(props.binder)}>
               <View style={styles.button}>
               <Image source={pic}/> 
               <Text>Failure</Text>
               </View>
               </TouchableOpacity>
      }
    }
    return(
      <View style={styles.mainContainer}>
        <View style={styles.toolbar}>
            <Picker selectedValue={this.state.stMarket} onValueChange={(itemValue, itemIndex) => this.setMarket(itemValue)} style={styles.toolbarButton}>
            {Object.keys(this.stMarketToIcon).map( (k,v) =>(<Picker.Item label={k} value={k} key={v} />))}
            </Picker>
           <Text style={styles.toolbarTitle}>{this.state.stMarket}</Text>
           <Text style={styles.toolbarButton}>Like</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.messageBox}>
            <Market jsonMarket={this.state.externalDataRes} binder={this} />
          </View>
        </View>
      </View>
      )
  }
}


const styles = StyleSheet.create({
  toolbar:{
      backgroundColor:'#81c04d',
      paddingTop:30,
      paddingBottom:10,
      flexDirection:'row'    //Step 1
  },
  toolbarButton:{
      width: 50,            //Step 2
      color:'#fff',
  },
  toolbarTitle:{
      color:'#fff',
      textAlign:'center',
      fontWeight:'bold',
      fontSize:40,
      flex:1                //Step 3
  },
  mainContainer: {
    flex: 1,
  },
  content: {
    backgroundColor:'#fff',
    alignItems:'center',
    flex:1
  },
  button: {
    alignItems:'center',
  },
  messageBox:{
    backgroundColor:'#fff',
    width:300,
    paddingTop:10,
    paddingBottom:20,
    paddingLeft:20,
    paddingRight:20, 
    borderRadius:10
}
});
