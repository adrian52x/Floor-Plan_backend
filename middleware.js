import jwt from "jsonwebtoken";


const verifyToken = (req, res, next) => {
    const cookie = req.cookies["jwt_auth"];

    if (!cookie) {
      return res.status(403).json({ message: "Unauthenticated"});
    }
    try {
        
        const decoded = jwt.verify(cookie, process.env.SECRET_KEY);
        req.user = decoded;


        console.log(req.query);

        // Checking for current user if userName is the same
        if(req.user.userName != req.query.userName){
            return res.status(401).send("unauthorized");
        }else{
            next(); 
        }

  
    } catch (err) {
        console.log(err);
      return res.status(401).json(err);
    }

};


const adminOnly = (req, res, next) => {
   
    const cookie = req.cookies["jwt_auth"];

    console.log(cookie);
  
    if (!cookie) {
      return res.status(403).send("Unauthenticated");
    }
    try {
        
        const decoded = jwt.verify(cookie, process.env.SECRET_KEY);
        req.user = decoded;

        console.log(req.user);

        // Checking if admin
        if( !(req.user.isAdmin === true ) ){
            return res.status(401).send("Access Denied");
        }  
        next();

  
    } catch (err) {
        console.log(err);
      return res.status(401).json(err);
    }

}



  export { verifyToken, adminOnly };