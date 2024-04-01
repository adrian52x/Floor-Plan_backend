import jwt from "jsonwebtoken";


// const verifyToken = (req, res, next) => {
//     const cookie = req.cookies["jwt_auth"];

//     if (!cookie) {
//       return res.status(403).json({ message: "Unauthenticated"});
//     }
//     try {
        
//         const decoded = jwt.verify(cookie, process.env.SECRET_KEY);
//         req.user = decoded;


//         console.log(req.query);

//         // Checking for current user if userName is the same
//         if(req.user.userName != req.query.userName){
//             return res.status(401).send("unauthorized");
//         }else{
//             next(); 
//         }

  
//     } catch (err) {
//         console.log(err);
//       return res.status(401).json(err);
//     }

// };

const viewer = (req, res, next) => {
   
  const token = req.headers.authorization;

  if (token === null || token === undefined || token === '' || token === 'null') {
    return res.status(403).send({ error: "Unauthenticated"});
  }
  try {
      
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;


      if( !(req.user.userRights.includes('admin') || req.user.userRights.includes('editor') || req.user.userRights.includes('viewer')  ) ){
        return res.status(401).send("Access Denied");
    }  
      next();


  } catch (err) {
      console.log(err);
    return res.status(401).json(err);
  }

}


const editor = (req, res, next) => {
   
  const token = req.headers.authorization;

  if (token === null || token === undefined || token === '' || token === 'null') {
    return res.status(403).send({ error: "Unauthenticated"});
  }
  try {
      
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;

      if( !(req.user.userRights.includes('admin') || req.user.userRights.includes('editor')  ) ){
        return res.status(401).send("Access Denied");
    }  
      next();


  } catch (err) {
      console.log(err);
    return res.status(401).json(err);
  }

}


const adminOnly = (req, res, next) => {
   
  const token = req.headers.authorization;

  if (token === null || token === undefined || token === '' || token === 'null') {
    return res.status(403).send({ error: "Unauthenticated"});
  }

  try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;


      // Checking if admin
      // if( !(req.user.isAdmin === true ) ){
      //     return res.status(401).send("Access Denied");
      // } 
      if( !(req.user.userRights.includes('admin') ) ){
        return res.status(401).send("Access Denied");
    }  
      next();


  } catch (err) {
      console.log(err);
      return res.status(401).send({ error: "Access Denied"});
  }

}



  export { adminOnly, editor, viewer };