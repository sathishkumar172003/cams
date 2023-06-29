const div = (a,b) =>{


    if ((a && b ) && (b != 0)){
        return a / b
    }
    if(b == 0){
        throw new Error('Denominator can not be 0')
    }else {
        throw new Error('Please enter a valid arguements !!!')
    }
    
}

try{
    div(5)
} catch(error) {
    console.log(error)
}


