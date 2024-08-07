class Validator{
    static  string(string,min,max=Infinity){
        return string.length>=min&&string.length<=max;
    }

    static  number(number,min,max=Infinity){
        return number>=min&&number<=max;
    }

}
module.exports={Validator}