// import { CustomRequest } from "@/types/custom";
// import { errRes } from "@/utils/error";
// import { Request, Response } from 'express';

// export const chatBarData = async (req: Request, res: Response): Promise<Response> => {
//     try {
//         const userId = (req as CustomRequest).userId;

//         if (!userId) {
//             return errRes(res, 400, 'user id not present');
//         }



//         return res.status(200).json({
//             success: true,
//             message: 'request accepted successfully'
//         });
//     } catch (error) {
//         return errRes(res, 500, "error while sending request");
//     }
// };