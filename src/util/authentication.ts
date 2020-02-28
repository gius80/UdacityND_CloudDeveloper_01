import { NextFunction } from 'connect';
import { Request, Response } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {

  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({ message: 'No authorization headers.' });
  }

  const token_bearer = req.headers.authorization.split(' ');
  if (token_bearer.length != 2) {
    return res.status(401).send({ message: 'Malformed token.' });
  }

  const token = token_bearer[1];

  // Mocked token, just for test purpose :)
  if (token !== "unsafe_fake_token_123456") {
    return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
  } else {
    return next();
  }

}