var login =function(user,password){
    console.log(user,password)
        if(user==="admin" && password==="root"){
            return true;
        }
        else{
            return false;
        }
    }
    module.exports=login;