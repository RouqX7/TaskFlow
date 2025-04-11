import { Request, Response, NextFunction } from 'express';
import {  DBResponse, PageInfo, ResponseCode } from '../types';
import Joi from 'joi';



export const validateApiQuery = ({requiredQuery, req, res, next}:{requiredQuery: string[]; req: Request, res: Response, next: NextFunction}) => {
    try{
    const missingQuery = requiredQuery.filter((query) => !req.query[query] && req.query[query] !== "");
    for(const query of missingQuery){
        return res.status(400).json({
            status:400,
            success:false,
            message:`Missing query parameter: ${query}`
        });
    }
    next();

    }catch(error){
        return res.status(400).json({
            status:400,
            success:false,
            error: (error as Error).message
        });
    }
    
}
export const validateApiBody = ({requiredBody, req, res, next}:{requiredBody: string[]; req: Request, res: Response, next: NextFunction}) => {
    try {
        if(!req.body){
            return res.status(400).json({
                status:400,
                success:false,
                message:`Missing body`
            });
        }
        const missingBody = requiredBody.filter((body) => !req.body[body] && req.body[body] !== 0);
        for(const body of missingBody){
            return res.status(400).json({
                status:400,
                success:false,
                message: `Missing body parameter: ${body}`
            });
        }
        next();
    } catch (error) {
        return res.status(400).json({
            status:400,
            success:false,
            error: (error as Error).message
        });
    }
}

export const successResponse = <T>({res, data,pageInfo, message}:{res: Response, data?: (T|T[]),  message?: string, pageInfo?: PageInfo}) => {
    return res.json({
        status:200,
        success:true,
        message: message ?? '',
        pageInfo,
        data
    });
}

export const errorResponse = ({res, error, code}:{res: Response, error: Error, code?: ResponseCode}) => {
    return res.status(code ?? 400).json({
        status:code ?? 400,
        success:false,
        error: error.message
    });
};

interface ServiceValidatorsParams<T,R> {
    schema?: Joi.ObjectSchema<T>;
    data?: T;
    next: (...args: unknown[]) => Promise<R>;
    message?:string
    errorMessage?:string
}

export const serviceValidators = async <T,R extends unknown>({schema, data, next,message,errorMessage}: ServiceValidatorsParams<T,R>) : Promise<DBResponse<R>>=> {
    try {
        if(schema && data){
            try {
                await schema.validateAsync(data);
            } catch (validationError) {
                return {
                    success: false,
                    message: `Validation failed: ${(validationError as Error).message}`,
                    status: 400,
                };
            }
        }
        const result = await next();
        return {
            success: true,
            message: message ?? "Data fetched successfully",
            status: 200,
            data: result,
        }; 
    } catch (error) {
        console.error('Service error:', error);
        return {
            success: false,
            message: `${errorMessage}: ${(error as Error).message}`,
            status: 400,
        };
    }
};
