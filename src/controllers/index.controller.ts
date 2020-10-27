import { Request, Response } from 'express';

export const privacy = (req: Request, res: Response) => res.render('index/privacy');

export const accessibility = (req: Request, res: Response) => res.render('index/accessibility');
