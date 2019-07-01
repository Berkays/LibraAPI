import { Router } from "express";

const router = Router();

router.post('/createAccount', (req,res) => {
    res.status(200).json({result:true,message:"OK"});
});


export default router;