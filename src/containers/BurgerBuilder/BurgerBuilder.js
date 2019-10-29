import React, { Component } from 'react'
import axios from '../../axios-orders'
import Aux from '../../hoc/Auxx'
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OderSummery from '../../components/Burger/OrderSummery/OrderSummery';
import Spinner from '../../components/UI/Spinner/Spinner';


const INGREDENTS_PRICE = {
    salad: 5,
    bacon: 8,
    meat: 20,
    cheese: 5
}

class BurgerBuilder extends Component {
    state = {
        ingredents : {
            salad: 0,
            bacon: 0,
            meat:0,
            cheese:0,
        },
        price: 10,
        purchasable : false,
        purchasing: false,
        loading: false,
    }


    increaseIngredents = (type) => {
        const oldCount = this.state.ingredents[type];
        const updatedCount = oldCount + 1;
        const updatedIngredents = {
            ...this.state.ingredents
        }
        updatedIngredents[type] = updatedCount;
        const priceTradition = INGREDENTS_PRICE[type]
        const oldPrice = this.state.price
        const currentPrice = oldPrice + priceTradition;

        this.setState({
            ingredents: updatedIngredents,
            price: currentPrice
        })
        this.updatePurchaseStatus(updatedIngredents)
    }
    
    decreaseIngredents = (type) => {
        const oldCount = this.state.ingredents[type];
        if(oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredents = {
            ...this.state.ingredents
        }
        updatedIngredents[type] = updatedCount;
        const priceTradition = INGREDENTS_PRICE[type]
        const oldPrice = this.state.price
        const currentPrice = oldPrice - priceTradition;

        this.setState({
            ingredents: updatedIngredents,
            price: currentPrice
        })
        this.updatePurchaseStatus(updatedIngredents)
    }

    
    updatePurchaseStatus(ingredents) {
        const total = 
            Object.keys(ingredents)
                .map(ingredent => {
                    return ingredents[ingredent]
                })
                .reduce((total,element) => {
                    return total + element;
                },0)
        this.setState({purchasable: total > 0})

    }

    // Purchasing Order Button
    purchasHandler = () => {
        this.setState({purchasing: true})
    }

    cancelPurchase = () => {
        this.setState({purchasing: false})
    }
    continuePurchase = () => {
        // set 'loading' fasle to display Loader
        this.setState({loading: true})
        // sending order summery to firebase server
        const order = {
            ingredents: this.state.ingredents,
            price: this.state.price,
            customer: {
                name: 'Shaon Kabir',
                address: {
                    street: 'Baganchara College road',
                    dist: 'Jashore',
                    country: 'Bangladesh',
                    zipCode: 7433,
                },
                email: 'shaonkabir98@gmail.com',
                phone: +8801916380678,
            },
            deliveryMethod: 'express/fastest',
        }
        // send data to firebase as 'orders.json'
        axios.post('/orders.json',order )
            .then(res => this.setState({loading: false, purchasing: false}))
            .catch(error => this.setState({loading: false, purchasing: false}))
    }

    render() {
        let disabledInfo = {...this.state.ingredents};
        for(var key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        // initial order summery markup
        let OrderSummery = <OderSummery
            ingredents={this.state.ingredents} 
            close={this.cancelPurchase}
            continue={this.continuePurchase}
            price={this.state.price}/>
        // check if DOM is loading,
        if(this.state.loading) {
            OrderSummery = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} close={this.cancelPurchase}>
                    {OrderSummery}
                </Modal>
                <Burger ingredents={this.state.ingredents} />
                <BuildControls 
                    lebel={this.state.ingredents} 
                    increase = {this.increaseIngredents}
                    decrease = {this.decreaseIngredents}
                    disabled = {disabledInfo}
                    price = {this.state.price}
                    purchasable ={this.state.purchasable}
                    order = {this.purchasHandler}
                />
            </Aux>
        )
    }
}
export default BurgerBuilder;