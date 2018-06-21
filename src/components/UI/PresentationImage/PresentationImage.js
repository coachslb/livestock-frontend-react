import React, { Component } from 'react';

class PresentationImage extends Component {

    constructor(){
        super();
        this.state = {
            image: 1
        }
        this.timer = null; 
        this.arrayPlusDelay = this.arrayPlusDelay.bind(this); 
    }

/*     arrayPlusDelay(array, delegate, delay) {
        var i = this.state.image;
        
        function loop() {
              // each loop, call passed in function
            delegate(array[i]);
            
            // increment, and if we're still here, call again
            if (i++ < array.length - 1)
               return setTimeout(loop, delay); //recursive
            else{
                i = 0;
                return setTimeout(loop, delay);
            }
                
        }
      
        // seed first call
        return setTimeout(loop, delay);
    } */

    arrayPlusDelay(array, delegate, delay) {
        let i = Math.floor(Math.random() * 8);
        const interval = setInterval(function() {
            delegate(array[i]);
            if (i++ >= array.length - 1)
                i = 0;
        }, delay)
        
        return interval
      }

    componentDidMount(){
        this.setState({image: Math.floor(Math.random() * 8) + 1});
        this.timer = this.arrayPlusDelay([1, 2, 3, 4, 5, 6, 7, 8], (obj) => {this.setState({image: obj})},30000)
    }

    componentWillUnmount(){
        clearTimeout(this.timer);
    }

    render(){
        const { image } = this.state
        return (
            <div
              className="presentation-image"
              style={{
                backgroundImage: `url('https://portal.agroop.net/bg-images/${image}.jpg')`,
                color: 'green',
              }}
            />
          );
    }
  
};

export default PresentationImage;
