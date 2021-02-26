import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { AppError } from "../errors/AppError";

class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveysUserRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUserRepository.findOne({
      id: String(u),
    });

    if (!surveyUser) {
      throw new AppError("Survey User not found");
    }

    surveyUser.value = Number(value);

    await surveysUserRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerController };
